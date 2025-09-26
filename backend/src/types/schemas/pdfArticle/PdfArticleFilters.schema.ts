import z from "zod";

export const PdfArticleFiltersSchema = z.object({
    title: z.string(),
    text: z.string(),
    authors: z.string(),
})
export type TypeofPdfArticleFiltersSchema = z.infer<typeof PdfArticleFiltersSchema>