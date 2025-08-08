import { Article } from "src/database/models/Article.model"
import { TypeofArticleSchema } from "src/types/schemas/article/Article.schema"
import { TypeofArticlePatchSchema } from "src/types/schemas/article/ArticlePatch.schema"

export interface ArticleServiceAbstract {
    getArticleById(id: number): Promise<Article>
    getFilteredArticle(filters: TypeofArticleSchema): Promise<Article>
    createArticle(options: TypeofArticlePatchSchema): Promise<Article>
    updateArcticle(id: number, options: TypeofArticlePatchSchema): Promise<Article>
    deleteArticle(ids: number[]): Promise<{ status: number }>
}