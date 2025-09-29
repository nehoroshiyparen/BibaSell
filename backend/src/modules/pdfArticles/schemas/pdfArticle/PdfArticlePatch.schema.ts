import z from "zod";
import { AuthorSchema } from "../author/Author.schema.js";

export const PdfArticlePatchSchema = z.object({
    title: z.string(),
    authors: z.array(z.string())
})
export type TypeofPdfArticlePatchSchema = z.infer<typeof PdfArticlePatchSchema>