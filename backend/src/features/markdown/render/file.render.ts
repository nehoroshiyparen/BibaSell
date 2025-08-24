import { ArticleFileInfo } from "#src/types/interfaces/files/ArticleFileInfo.interface";

export function fileRender(markdown: string, files: ArticleFileInfo[]) {
    for (const file of files) {
        markdown = markdown.replaceAll(`path/${file.originalName}`, file.path)
    }

    return markdown
}