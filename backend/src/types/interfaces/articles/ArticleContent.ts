import { HeadingBase } from "../headings/HeadingBase.js"

export interface ArticleContent {
    content_html: string
    headings?: HeadingBase[]
}