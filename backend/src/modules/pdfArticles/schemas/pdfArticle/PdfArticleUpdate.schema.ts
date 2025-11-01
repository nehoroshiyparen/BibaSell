import z from "zod";
import { UpdateOptionsSchema } from "../options/UpdateOptionsSchema.js";

export const PdfArticleUpdateSchema = z.object({
    title: z.string().nullable().optional(),
    authors: z.array(z.string()).nullable().optional(),
    functions: UpdateOptionsSchema.optional(),
})
export type TypeofPdfArticleUpdateSchema = z.infer<typeof PdfArticleUpdateSchema>