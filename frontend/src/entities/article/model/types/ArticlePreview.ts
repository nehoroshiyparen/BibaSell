import type { Author } from "./Author"

export interface ArticlePreview {
    id: number
    slug: string
    title: string
    publishedAt: Date
    authors: Author[]
    preview: string
}