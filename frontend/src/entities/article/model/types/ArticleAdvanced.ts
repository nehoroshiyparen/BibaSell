import type { Author } from "./Author";

export interface ArticleAdvanced {
    id: number,
    title: string,
    key: string,
    fistpage_key: string,
    publishedAt: Date,
    authors: Author[]
}