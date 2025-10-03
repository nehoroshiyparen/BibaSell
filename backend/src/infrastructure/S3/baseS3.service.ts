import { IS3 } from "#src/types/contracts/core/s3.interface.js"

export abstract class BaseS3Service {
    protected abstract prefix: string

    constructor(protected readonly s3: IS3) {}

    private buildKey(key: string): string {
        return `${this.prefix}${key}`
    }

    async upload(key: string, body: Buffer, options?: { contentType?: string, ACL?: string}): Promise<void> {
        return this.s3.upload(this.buildKey(key), body, options)
    }

    async get(key: string): Promise<Buffer> {
        return this.s3.get(this.buildKey(key))
    }

    async delete(key: string): Promise<void> {
        return this.s3.delete(this.buildKey(key))
    }

    async list(): Promise<string[]> {
        return this.s3.list(this.prefix)
    }
}