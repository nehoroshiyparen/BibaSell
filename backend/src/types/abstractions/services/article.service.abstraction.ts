import { Article } from "src/database/models/Article.model"
import { ArticleContent } from "src/types/interfaces/articles/ArticleContent"
import { ArticlePreview } from "src/types/interfaces/articles/ArticlePreview"
import { TypeofArticleFiltersSchema } from "src/types/schemas/article/ArticleFilters.schema"
import { TypeofAdvancedArticleSchema } from "src/types/schemas/article/ArticlePatch.schema"

export interface ArticleServiceAbstract {
    getArticleById(id: number): Promise<ArticlePreview>
    getFilteredArticle(filters: TypeofArticleFiltersSchema): Promise<ArticlePreview[]>
    getArticleByContent(content: string): Promise<unknown>
    getArticleContentById(id: number): Promise<ArticleContent>
    createArticle(options: TypeofAdvancedArticleSchema): Promise<Article>
    updateArcticle(id: number, options: TypeofAdvancedArticleSchema): Promise<Article>
    deleteArticles(ids: number[]): Promise<{ status: number }>
}