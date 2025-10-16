import { TYPES } from "#src/di/types.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { inject, injectable } from "inversify";
import { TypeofPdfAcrticlePreviewSchema } from "../schemas/pdfArticle/PdfArticlePreview.schema.js";
import { S3PdfArticleServiceImpl } from "../services/S3PdfArticle.service.impl.js";
import { TypeofPdfArticleFullSchema } from "../schemas/pdfArticle/PdfArticleFull.schema.js";

@injectable()
export class PdfArticleMapper {
    constructor(
        @inject(TYPES.S3PdfArticleService) private s3: S3PdfArticleServiceImpl
    ) {}

    async toFull(article: PdfArticle): Promise<TypeofPdfArticleFullSchema> {
        const [pdfUrls, previewUrls] = await Promise.all([
            this.s3.getSignedUrls([article.key]),
            this.s3.getSignedUrls([article.firstpage_key], 'article_previews/')
        ])
        return { ...article.toJSON(), key: pdfUrls[article.key], firstpage_key: previewUrls[article.firstpage_key] }
    }

    async toPreview(articles: PdfArticle[]): Promise<TypeofPdfAcrticlePreviewSchema[]> {
        const json = articles.map(article => article.toJSON())
        const modifiedArticles: TypeofPdfAcrticlePreviewSchema[] = await Promise.all(json.map(async article => {
            const preview_urls = await this.s3.getSignedUrls([article.firstpage_key], 'article_previews/')
            return {
                id: article.id,
                slug: article.slug,
                title: article.title,
                publishedAt: article.publishedAt,
                authors: article.authors,
                firstpage_key: preview_urls[article.firstpage_key]
            }
        }))
        return modifiedArticles
    }
} 