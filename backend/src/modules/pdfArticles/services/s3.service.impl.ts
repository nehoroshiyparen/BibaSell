import { TYPES } from "#src/di/types.js";
import { IS3 } from "#src/types/contracts/core/s3.interface.js";
import { inject, injectable } from "inversify";

@injectable()
export class S3PdfArticleService {
    constructor(
        @inject(TYPES.) private s3: IS3
    ) {}

    async uploadArticle(key: string, body: Buffer, contentType?: string): Promise<void> {
        
    }

    async getArticle(): Promise<Buffer> {

    }

    async deleteArticle(): Promise<void> {

    }

    async listArticles(): Promise<string[]> {

    }
}