import { Author } from "#src/database/models/Author/Author.model.js";
import { PdfArticle } from "#src/database/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfAcrticlePreviewSchema } from "#src/types/schemas/pdfArticle/PdfArticlePreview.schema.js";

type PdfArticleWithAuthors = PdfArticle & {
    authors: Author[]
}

export function toPdfArticlePreview(a: PdfArticleWithAuthors): TypeofPdfAcrticlePreviewSchema {
    return {
        id: a.id,
        title: a.title,
        firstpage: '',
        publishedAt: a.pusblishedAt,
        authors: a.authors.map(author => ({
            id: author.id,
            name: author.name
        }))
    }
}