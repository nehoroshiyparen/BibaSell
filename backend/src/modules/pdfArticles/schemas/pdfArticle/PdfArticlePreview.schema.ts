import z from "zod";
import { AuthorSchema } from "../author/Author.schema.js";

export const PdfArticlePreviewSchema = z.object({
    id: z.number(),
    title: z.string(),
    firstpage: z.any(),
    publishedAt: z.date(),
    authors: z.array(AuthorSchema)
})
export type TypeofPdfAcrticlePreviewSchema = z.infer<typeof PdfArticlePreviewSchema>