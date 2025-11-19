import type { Author } from "./Author";

export interface ArticleAdvanced {
    id: number,
    title: string,
    key: string,
    preview: string,
    publishedAt: Date,
    authors: Author[]
}