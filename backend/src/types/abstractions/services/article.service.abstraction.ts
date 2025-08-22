import { Article } from "#src/database/models/Article.model.js"
import { Heading } from "#src/database/models/Heading.model"
import { ArticleContent } from "#src/types/interfaces/articles/ArticleContent.js"
import { ArticlePreview } from "#src/types/interfaces/articles/ArticlePreview.js"
import { TypeofArticleFiltersSchema } from "#src/types/schemas/article/ArticleFilters.schema.js"
import { TypeofAdvancedArticleSchema } from "#src/types/schemas/article/ArticlePatch.schema.js"
import { TypeofArticleUpdateSchema } from "#src/types/schemas/article/ArticleUpdate.schema.js"

export interface ArticleServiceAbstract {
    getArticleById(id: number): Promise<ArticlePreview>
    getFilteredArticles(filters: TypeofArticleFiltersSchema): Promise<ArticlePreview[]>
    searchArticleByContent(content: string): Promise<{ article: Article, content_html: string }>
    getArticleContent(id: number): Promise<ArticleContent>
    createArticle(options: TypeofAdvancedArticleSchema): Promise<Article>
    updateArcticle(id: number, options: TypeofArticleUpdateSchema): Promise<{ article: Article, headings: Heading[] | null }>
    bulkDeleteArticles(ids: number[]): Promise<{ status: number }>
}