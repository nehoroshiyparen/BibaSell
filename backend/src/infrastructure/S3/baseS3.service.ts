import { IBaseS3Repo } from "#src/types/contracts/core/base.s3-repo.interface.js"

export abstract class BaseS3Service {
    protected abstract prefix: string | string[]

    constructor(protected readonly s3: IBaseS3Repo) {}

    private buildKey(key: string, prefix?: string): string {
        const usedPrefix = prefix ?? (Array.isArray(this.prefix) ? this.prefix[0] : this.prefix)
        return `${usedPrefix}${key}`
    }

    async upload(key: string, body: Buffer, options?: { prefix?: string; contentType?: string; ACL?: string }): Promise<void> {
        return this.s3.upload(this.buildKey(key, options?.prefix), body, options)
    }

    async get(key: string, prefix?: string): Promise<Buffer> {
        return this.s3.get(this.buildKey(key, prefix))
    }

    async delete(key: string, prefix?: string): Promise<void> {
        return this.s3.delete(this.buildKey(key, prefix))
    }

    async list(prefix?: string): Promise<string[]> {
        const usedPrefix = prefix ?? (Array.isArray(this.prefix) ? this.prefix[0] : this.prefix)
        return this.s3.list(usedPrefix)
    }

    async getSignedUrls(keys: string[], prefix?: string): Promise<Record<string, string>> {
        const usedPrefix = prefix ?? (Array.isArray(this.prefix) ? this.prefix[0] : this.prefix)
        return this.s3.generateSignedUrls(keys.map(key => this.buildKey(key, usedPrefix)))
    }
}