import { HeadingBase } from "../headings/HeadingBase"

export interface ArticleContent {
    content_html: string
    headings?: HeadingBase[]
}