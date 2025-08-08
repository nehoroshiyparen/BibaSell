import { inject, injectable } from "inversify";
import { Sequelize } from "sequelize";
import { Article } from "src/database/models/Article.model";
import { TYPES } from "src/di/types";
import { ArticleServiceAbstract } from "src/types/abstractions/services/article.service.abstraction";
import { TypeofArticleSchema } from "src/types/schemas/article/Article.schema";
import { TypeofArticlePatchSchema } from "src/types/schemas/article/ArticlePatch.schema";

@injectable()
export class ArticleServiceImpl implements ArticleServiceAbstract {
    constructor(
        @inject(TYPES.Sequelize) private sequelize: Sequelize
    ) {}

    async getArticleById(id: number): Promise<Article> {
        
    }

    async getFilteredArticle(filters: TypeofArticleSchema): Promise<Article> {
        
    }

    async createArticle(options: TypeofArticlePatchSchema): Promise<Article> {
        
    }

    async updateArcticle(id: number, options: TypeofArticlePatchSchema): Promise<Article> {
        
    }

    async deleteArticle(ids: number[]): Promise<{ status: number }> {
        
    }
}