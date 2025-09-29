import z from "zod";

export const PdfArticleFull = z.object({
    filePath: z.string(),
    extractedText: z.string().optional()
})
export type TypeofPdfArticleFullSchema = z.infer<typeof PdfArticleFull>