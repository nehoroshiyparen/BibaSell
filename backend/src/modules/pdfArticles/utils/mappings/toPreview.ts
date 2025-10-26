import { Author } from "#src/infrastructure/sequelize/models/Author/Author.model.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfAcrticlePreviewSchema } from "../../schemas/pdfArticle/PdfArticlePreview.schema.js";
import { PdfArticleJson } from "./arrayToPreview.js";

export function toPdfArticlePreview(a: PdfArticleJson): TypeofPdfAcrticlePreviewSchema {
    return {
        id: a.id,
        title: a.title,
        firstpage_key: a.firstpage_key,
        publishedAt: a.publishedAt,
        authors: a.authors.map(author => ({
            id: author.id,
            name: author.name
        }))
    }
}