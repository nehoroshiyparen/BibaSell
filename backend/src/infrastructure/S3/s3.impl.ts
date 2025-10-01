import { IS3 } from "#src/types/contracts/core/s3.interface.js";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { injectable } from "inversify";
import { s3 } from "./s3.config.js";
import { Readable } from "stream";
import { ApiError } from "#src/shared/ApiError/ApiError.js";

@injectable()
export class S3Impl implements IS3 {
    private client: S3Client
    private bucketName: string

    constructor(

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
            await this.client.send(command)
        } catch (e) {
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
            return Buffer.concat(chunks)
        } catch (e) {
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
        } catch (e) {
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
            return (response.Contents || []).map(obj => obj.Key!)
        } catch (e) {
            throw ApiError.S3(`S3 list failed (prefix: ${prefix})`, undefined, e)
        }
    }
}