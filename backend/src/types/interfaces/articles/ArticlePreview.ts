import { HeadingBase } from "../headings/HeadingBase";

export interface ArticlePreview {
    id: number,
    title: string,
    slug: string,
    author_username: string,
    event_start_date: Date,
    event_end_date: Date,
    headings?: HeadingBase[]
}