import z from "zod";

export const PdfArticleFiltersSchema = z.object({
    title: z.string(),
    extractedText: z.string(),
    author: z.string(),
})
export type TypeofPdfArticleFiltersSchema = z.infer<typeof PdfArticleFiltersSchema>