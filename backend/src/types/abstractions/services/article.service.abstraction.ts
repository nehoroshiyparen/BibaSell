import { Article } from "#src/database/models/Article.model.js"
import { ArticleContent } from "#src/types/interfaces/articles/ArticleContent.js"
import { ArticlePreview } from "#src/types/interfaces/articles/ArticlePreview.js"
import { TypeofArticleFiltersSchema } from "#src/types/schemas/article/ArticleFilters.schema.js"
import { TypeofAdvancedArticleSchema } from "#src/types/schemas/article/ArticlePatch.schema.js"

export interface ArticleServiceAbstract {
    getArticleById(id: number): Promise<ArticlePreview>
    getFilteredArticles(filters: TypeofArticleFiltersSchema): Promise<ArticlePreview[]>
    searchArticleByContent(content: string): Promise<{ article: Article, content_html: string }>
    getArticleContent(id: number): Promise<ArticleContent>
    createArticle(options: TypeofAdvancedArticleSchema): Promise<Article>
    updateArcticle(id: number, options: TypeofAdvancedArticleSchema): Promise<Article>
    bulkDeleteArticles(ids: number[]): Promise<{ status: number }>
}