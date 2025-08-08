import z from "zod";

export const ArticleSchema = z.object({
    title: z.string(),
    slug: z.string(),
    cover_image_url: z.string(),
    author_username: z.string(),
    content_markdown: z.string(),
    content_html: z.string(),
    is_published: z.string()
})

export type TypeofArticleSchema = z.infer<typeof ArticleSchema>