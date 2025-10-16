import z from "zod";

export const PdfArticleFull = z.object({
    key: z.string(),
    firstpage_key: z.string(),
    extractedText: z.string().optional()
})
export type TypeofPdfArticleFullSchema = z.infer<typeof PdfArticleFull>