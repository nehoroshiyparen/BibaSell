import { inject, injectable } from "inversify";
import { Redis } from "ioredis";
import { Sequelize } from "sequelize";
import { redisIdPrefixes } from "src/consts";
import { DatabaseImpl } from "src/database/database.impl";
import { Article } from "src/database/models/Article.model";
import { Heading } from "src/database/models/Heading.model";
import { TYPES } from "src/di/types";
import { headersParser } from "src/features/markdown/parsing/header.parser";
import { MdxParser } from "src/features/markdown/parsing/mdx.parser";
import { getSlug } from "src/features/slugging/getSlug";
import { RedisImpl } from "src/redis/redis.impl";
import { ArticleServiceAbstract } from "src/types/abstractions/services/article.service.abstraction";
import { ArticleContent } from "src/types/interfaces/articles/ArticleContent";
import { ArticlePreview } from "src/types/interfaces/articles/ArticlePreview";
import { TypeofArticleSchema } from "src/types/schemas/article/Article.schema";
import { TypeofArticleFiltersSchema } from "src/types/schemas/article/ArticleFilters.schema";
import { TypeofAdvancedArticleSchema } from "src/types/schemas/article/ArticlePatch.schema";
import { ApiError } from "src/utils/ApiError/ApiError";
import { RethrowApiError } from "src/utils/ApiError/RethrowApiError";

@injectable()
export class ArticleServiceImpl implements ArticleServiceAbstract {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: DatabaseImpl,
        @inject(TYPES.Redis) private redis: RedisImpl,
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async getArticleById(id: number): Promise<ArticlePreview> {
        try {
            const article = await Article.findByPk(
                id,
                {
                    attributes: [
                        'id', 
                        'title', 
                        'slug', 
                        'author_username', 
                        'event_start_date', 
                        'event_start_date'
                    ],
                    include: [
                        {
                            model: Heading,
                            as: 'headings',
                            attributes: ['id', 'title'],
                            limit: 5
                        }
                    ]
                }
            )

            if (!article) throw ApiError.NotFound(`Article not found`)

            return article
        } catch (e) {
            RethrowApiError(`Service error: Method - getArticleById`, e)
        }
    }

    async getFilteredArticle(filters: TypeofArticleFiltersSchema): Promise<ArticlePreview[]> {
        try {
            const articles = await Article.findAll({
                where: {
                    ...filters
                },
                attributes: [
                    'id', 
                    'title', 
                    'slug', 
                    'author_username', 
                    'event_start_date', 
                    'event_start_date'
                ],
                include: [
                    {
                        model: Heading,
                        as: 'headings',
                        attributes: ['id', 'title'],
                        limit: 5
                    }
                ]
            })

            return articles
        } catch (e) {
            RethrowApiError(`Service error: Method - getFilteredArticle`, e)
        }
    }

    async getArticleByContent() {
        
    }

    async getArticleContentById(id: number): Promise<ArticleContent> {
        const article = await Article.findByPk(id, {
            attributes: [],
            include: [
                {
                    model: Heading,
                    as: 'headings',
                    attributes: ['id', 'title'],
                }
            ]
        })

        if (!article) throw ApiError.NotFound(`Article with id: ${id}, not found`)

        const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${id}`])
        const content_html = await this.redis.getValue(key)

        if (!content_html) throw ApiError.NotFound(`Content for article with id ${id} not found`)

        return { content_html, headings: article.headings }
    }

    async createArticle(options: TypeofAdvancedArticleSchema): Promise<Article> {
        try {
            const { content_markdown, headings, ...articleOpt } = options

            const slug = getSlug(options.title)

            const processedHeadings  = headersParser(options.content_markdown)
            headings?.forEach((heading) => processedHeadings.push(heading.title))

            const content_html = await MdxParser(options.content_markdown)

            const article = await Article.create({
                ...articleOpt,
                slug,
                content_markdown
            })

            await Promise.all(
                processedHeadings.map(async (heading) => {
                    try {
                        await Heading.create({
                            title: heading,
                            article_id: article.id,
                        })
                    } catch (e) {
                        throw ApiError.BadRequest(`Error while creating heading: ${heading}`)
                    }
                })
            )

            const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${article.id}`])
            this.redis.setValue(key, content_html)

            return article
        } catch (e) {
            RethrowApiError(`Service error: Method - createArticle`, e)
        }
    }

    async updateArcticle(id: number, options: TypeofAdvancedArticleSchema): Promise<Article> {
        try {

        } catch (e) {
            RethrowApiError(`Service error: Method - updateArcticle`, e)
        }
    }

    async deleteArticles(ids: number[]): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction();
        const errorLimit = Math.floor(ids.length / 2);
        let errorCounter = 0;
    
        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) {
                        throw ApiError.BadRequest(`Too many failed requests, changes will be rolled back`);
                    }
    
                    await Article.destroy({
                        where: { id },
                        transaction
                    });
                } catch (e) {
                    errorCounter++;
                    console.log(`Error while deleting article with id: ${id} \n Error: ${e}`);
                    
                    if (errorCounter >= errorLimit) {
                        break;
                    }
                }
            }
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                await transaction.commit();
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                await transaction.rollback();
                return { status: 400 };
            }
    
            await transaction.commit();
            return { status: 200 };
        } catch (e) {
            await transaction.rollback();
            throw RethrowApiError(`Service error: Method - deleteArticles`, e);
        }
    }
}