import z from "zod";

export const PdfArticleUpdateSchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    authors: z.array(z.string()).optional()
})
export type TypeofPdfArticleUpdateSchema = z.infer<typeof PdfArticleUpdateSchema>