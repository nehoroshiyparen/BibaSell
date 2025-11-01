import { Author } from "#src/infrastructure/sequelize/models/Author/Author.model.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfAcrticlePreviewSchema } from "../../schemas/pdfArticle/PdfArticlePreview.schema.js";
import { toPdfArticlePreview } from "./toPreview.js";

export interface PdfArticleJson {
    id: number
    title: string
    slug: string
    key: string
    preview_key: string
    extractedText?: string
    publishedAt: Date
    updatedAt: Date
    authors: { id: number; name: string }[]
}

export function arrayToPdfArticlePreview(articles: (PdfArticleJson | null)[]): TypeofPdfAcrticlePreviewSchema[] {
    if (!Array.isArray(articles)) return []

    const results = articles.filter(
        (a): a is PdfArticleJson => a !== null
    )
    
    return results.map(toPdfArticlePreview)
}