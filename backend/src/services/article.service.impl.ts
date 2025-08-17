import { inject, injectable } from "inversify";
import { Redis } from "ioredis";
import { Op, Sequelize } from "sequelize";
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
import { HeadingBase } from "src/types/interfaces/headings/HeadingBase";
import { TypeofArticleSchema } from "src/types/schemas/article/Article.schema";
import { TypeofArticleFiltersSchema } from "src/types/schemas/article/ArticleFilters.schema";
import { TypeofAdvancedArticleSchema } from "src/types/schemas/article/ArticlePatch.schema";
import { ApiError } from "src/utils/ApiError/ApiError";
import { RethrowApiError } from "src/utils/ApiError/RethrowApiError";
import { cleanup } from "src/utils/helper/object.cleanup";
import { sanitizeMarkdownToText } from "src/utils/sanitize/markdown";
import { ValidateObjectFieldsNotNull } from "src/utils/validations/objectFieldsNotNull.validate";

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

    async getFilteredArticles(filters: TypeofArticleFiltersSchema): Promise<ArticlePreview[]> {
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
            RethrowApiError(`Service error: Method - getFilteredArticles`, e)
        }
    }

    async searchArticleByContent(content: string) {
        try {
            console.log(content)

            const cleanedContent = sanitizeMarkdownToText(content)

            const article = await Article.findOne({
                where: { content_markdown: { [Op.like]: `%${cleanedContent}%` } },
                attributes: ['id', 'title', 'slug', 'author_username', 'event_start_date', 'event_end_date']
            })

            if (!article) throw ApiError.NotFound("Article not found")

            const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${article.id}`])
            const cachedHtml = await this.redis.getValue(key)

            if (!cachedHtml) throw ApiError.NotFound(`Content for this article was not found`)

            return {
                article,
                content_html: cachedHtml,
            }
        } catch (e) {
            RethrowApiError(`Service error: Method - searchArticleByContent`, e)
        }
    }

    async getArticleContent(id: number): Promise<ArticleContent> {
        try {
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
    
            return { content_html, headings: article.headings ?? [] }
        } catch (e) {
            RethrowApiError(`Service error: Method - getArticleContent`, e)
        }
    }

    async createArticle(options: TypeofAdvancedArticleSchema): Promise<Article> {
        const transaction = await this.sequelize.transaction()
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
            }, { transaction })

            await Promise.all(
                processedHeadings.map(async (heading) => {
                    try {
                        await Heading.create({
                            title: heading,
                            article_id: article.id,
                        }, { transaction })
                    } catch (e) {
                        throw ApiError.BadRequest(`Error while creating heading: ${heading}`)
                    }
                })
            )

            const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${article.id}`])
            this.redis.setValue(key, content_html)

            await transaction.commit()

            return article
        } catch (e) {
            await transaction.rollback()
            RethrowApiError(`Service error: Method - createArticle`, e)
        }
    }

    async updateArcticle(id: number, options: TypeofAdvancedArticleSchema): Promise<Article> {
        const transaction = await this.sequelize.transaction()
        try {
            const { content_markdown, headings, ...articleOpt } = options

            const article = await Article.findByPk(id)
            if (!article) throw ApiError.NotFound(`Article with id: ${id} not found`)

            const slug = getSlug(options.title)

            const updateData = cleanup({
                ...articleOpt,
                slug,
                content_markdown,
            })

            if (Object.keys(updateData).length > 0) {
                await Article.update(updateData, { 
                    where: 
                        {
                            id 
                        },
                    transaction
                    }
                )
            }
            
            // Удаление старых заголовков и создание новых
            if (headings || content_markdown) {
                await Heading.destroy({
                    where: {
                        article_id: id
                    }, transaction
                })
    
                const processedHeadings  = headersParser(options.content_markdown)
                headings?.forEach((heading) => processedHeadings.push(heading.title))

                await Promise.all(
                    processedHeadings.map(async (heading) => {
                        try {
                            await Heading.create({
                                title: heading,
                                article_id: id,
                            }, { transaction })
                        } catch (e) {
                            throw ApiError.BadRequest(`Error while creating heading: ${heading}`)
                        }
                    })
                )
            }

            // Парсинг маркдауна
            if (content_markdown) {
                const content_html = await MdxParser(content_markdown)
                const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${id}`])
                this.redis.setValue(key, content_html)
            }

            await transaction.commit()
            await article.reload({ transaction })

            return article
        } catch (e) {
            await transaction.rollback()
            RethrowApiError(`Service error: Method - updateArcticle`, e)
        }
    }

    async bulkDeleteArticles(ids: number[]): Promise<{ status: number }> {
        const errorLimit = Math.floor(ids.length / 2);
        let errorCounter = 0;
    
        try {
           for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) break

                    await this.sequelize.transaction(async (t) => {
                        await Article.destroy({
                            where: { id },
                            transaction: t
                        })
                    })
                } catch (e) {
                    errorCounter++
                    console.log(`Error while deleting article with id: ${id} \n Error: ${e}`)
                }
           }
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                return { status: 400 };
            }
    
            return { status: 200 };
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkDeleteArticles`, e);
        }
    }
}