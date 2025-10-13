import { IBaseS3Repo } from "#src/types/contracts/core/base.s3-repo.interface.js";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { inject, injectable } from "inversify";
import { s3 } from "./s3.config.js";
import { Readable } from "stream";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { TYPES } from "#src/di/types.js";

@injectable()
export class BaseS3Repo implements IBaseS3Repo {
    private client: S3Client
    private bucketName: string

    constructor(
        @inject(TYPES.S3Logger) private logger: StoreLogger
    ) {
        this.client = s3
        this.bucketName = 'history-project-storage'
    }
    
    async upload(key: string, body: Buffer, options?: { contentType?: string, ACL: 'public-read' }): Promise<void> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: body,
                ContentType: options?.contentType,
                ACL: options?.ACL
            })
            console.log(command)
            await this.client.send(command)
            this.logger.info(`Key: ${key} is uploaded`)
        } catch (e) {
            this.logger.exceptions.storeException(e, `Key: ${key}. Upload error`)
            throw ApiError.S3(`S3 upload failed (key: ${key})`, undefined, e)
        }
    }

    async get(key: string): Promise<Buffer> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key
            })
            const response = await this.client.send(command)

            const stream = response.Body as Readable
            const chunks: Buffer[] = []
            for await (const chunk of stream) {
                chunks.push(Buffer.from(chunk))
            }
            this.logger.info(`Fetched key: ${key}`)
            return Buffer.concat(chunks)
        } catch (e) {
            this.logger.exceptions.storeException(e, `Key: ${key}. Fetch error`)
            throw ApiError.S3(`S3 get failed (key: ${key}`, undefined, e)
        }
    }

    async delete(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            })
            await this.client.send(command)
            this.logger.operations.deleted(`Key: ${key}`)
        } catch (e) {
            this.logger.exceptions.storeException(e, `Key: ${key}. Delete error`)
            throw ApiError.S3(`S3 delete failed (key: ${key})`, undefined, e)
        }
    }

    async list(prefix?: string): Promise<string[]> {
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: prefix
            })
            const response = await this.client.send(command)
            this.logger.info(`${this.bucketName}/${prefix} is listed`)
            return (response.Contents || []).map(obj => obj.Key!)
        } catch (e) {
            this.logger.exceptions.storeException(e, `Prefix: ${prefix}. List error`)
            throw ApiError.S3(`S3 list failed (prefix: ${prefix})`, undefined, e)
        }
    }
}