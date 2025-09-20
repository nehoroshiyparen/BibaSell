import { MDXArticleFileInfo } from "#src/types/interfaces/files/MDXArticleFileInfo.interface";

export function fileRender(markdown: string, files: MDXArticleFileInfo[]) {
    for (const file of files) {
        markdown = markdown.replaceAll(`path/${file.originalName}`, file.path)
    }

    return markdown
}