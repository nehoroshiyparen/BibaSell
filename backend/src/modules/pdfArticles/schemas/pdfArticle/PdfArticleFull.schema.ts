import z from "zod";
import { AuthorSchema } from "../author/Author.schema.js";

export const PdfArticleFull = z.object({
    id: z.number(),
    title: z.string(),
    key: z.string(),
    firstpage_key: z.string(),
    publishedAt: z.date(),
    authors: z.array(AuthorSchema)
})
export type TypeofPdfArticleFullSchema = z.infer<typeof PdfArticleFull>