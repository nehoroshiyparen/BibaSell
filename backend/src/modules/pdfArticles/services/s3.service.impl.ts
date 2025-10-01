import { TYPES } from "#src/di/types.js";
import { IS3 } from "#src/types/contracts/core/s3.interface.js";
import { inject, injectable } from "inversify";

@injectable()
export class S3PdfArticleService {
    private readonly prefix = 'articles/' 

    constructor(
        @inject(TYPES.S3) private s3: IS3
    ) {}

    private buildKey(key: string): string {
        return `${this.prefix}${key}`
    }

    async uploadArticle(key: string, body: Buffer, options?: { contentType?: string, ACL?: string}): Promise<void> {
        return this.s3.upload(this.buildKey(key), body, options)
    }

    async getArticle(key: string): Promise<Buffer> {
        return this.s3.get(this.buildKey(key))
    }

    async deleteArticle(key: string): Promise<void> {
        return this.s3.delete(this.buildKey(key))
    }

    async listArticles(): Promise<string[]> {
        return this.s3.list(this.prefix)
    }
}