import { Author } from "#src/database/models/Author/Author.model.js";
import { PdfArticle } from "#src/database/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfAcrticlePreviewSchema } from "#src/types/schemas/pdfArticle/PdfArticlePreview.schema.js";
import { toPdfArticlePreview } from "./toPreview.js";

export function arrayToPdfArticlePreview(articles: (PdfArticle | null)[]): TypeofPdfAcrticlePreviewSchema[] {
    if (!articles) return []
    const results = articles.filter(
        (a): a is PdfArticle & { authors: Author[] } => a !== null
    )
    return results.map(toPdfArticlePreview)
}