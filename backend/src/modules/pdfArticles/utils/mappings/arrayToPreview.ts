import { Author } from "#src/infrastructure/sequelize/models/Author/Author.model.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfAcrticlePreviewSchema } from "../../schemas/pdfArticle/PdfArticlePreview.schema.js";
import { toPdfArticlePreview } from "./toPreview.js";

export function arrayToPdfArticlePreview(articles: (PdfArticle | null)[]): TypeofPdfAcrticlePreviewSchema[] {
    if (!Array.isArray(articles)) return []

    const results = articles.filter(
        (a): a is PdfArticle & { authors: Author[] } => a !== null
    )
    return results.map(toPdfArticlePreview)
}