import z from "zod";

export const ArticleFileUpdateSchema = z.object({
    delete: z.array(z.number()).optional().nullable(),
}).strict()
export type TypeofArticleFileUpdateSchema = z.infer<typeof ArticleFileUpdateSchema>