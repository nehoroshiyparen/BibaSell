import { HeadingBase } from "../headings/HeadingBase.js"

export interface MDXArticleContent {
    content_html: string
    headings?: HeadingBase[]
}