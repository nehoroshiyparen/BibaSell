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
        const pdfUrls = await this.s3.getSignedUrls([article.key])
        const previewUrls = article.preview_key ? await this.s3.getSignedUrls([article.preview_key], 'article_previews/') : null
        return { 
            id: article.id,
            title: article.title,
            key: pdfUrls[article.key], 
            preview: previewUrls ? previewUrls[article.preview_key] : article.defaultPreview,
            publishedAt: article.publishedAt,
            authors: article.authors?.map(a => ({ id: a.id, name: a.name })) || [],
        }
    }

    async toPreview(articles: PdfArticle[]): Promise<TypeofPdfAcrticlePreviewSchema[]> {
        const json = articles.map(article => article.toJSON())
        const modifiedArticles: TypeofPdfAcrticlePreviewSchema[] = await Promise.all(json.map(async article => {
            const preview_urls = article.preview_key ? await this.s3.getSignedUrls([article.preview_key], 'article_previews/') : null
            return {
                id: article.id,
                slug: article.slug,
                title: article.title,
                publishedAt: article.publishedAt,
                authors: article.authors,
                preview: preview_urls ? preview_urls[article.preview_key] : article.defaultPreview
            }
        }))
        return modifiedArticles
    }
} 