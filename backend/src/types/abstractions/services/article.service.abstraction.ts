import { Article } from "src/database/models/Article.model"
import { ArticleContent } from "src/types/interfaces/articles/ArticleContent"
import { ArticlePreview } from "src/types/interfaces/articles/ArticlePreview"
import { HeadingBase } from "src/types/interfaces/headings/HeadingBase"
import { TypeofArticleFiltersSchema } from "src/types/schemas/article/ArticleFilters.schema"
import { TypeofAdvancedArticleSchema } from "src/types/schemas/article/ArticlePatch.schema"

export interface ArticleServiceAbstract {
    getArticleById(id: number): Promise<ArticlePreview>
    getFilteredArticles(filters: TypeofArticleFiltersSchema): Promise<ArticlePreview[]>
    searchArticleByContent(content: string): Promise<{ article: Article, content_html: string }>
    getArticleContent(id: number): Promise<ArticleContent>
    createArticle(options: TypeofAdvancedArticleSchema): Promise<Article>
    updateArcticle(id: number, options: TypeofAdvancedArticleSchema): Promise<Article>
    bulkDeleteArticles(ids: number[]): Promise<{ status: number }>
}