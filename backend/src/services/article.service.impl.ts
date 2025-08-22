import { inject, injectable } from "inversify";
import { Op, Sequelize, Transaction } from "sequelize";
import { redisIdPrefixes } from "#src/consts/index.js";
import { DatabaseImpl } from "#src/database/database.impl.js";
import { Article } from "#src/database/models/Article.model.js";
import { Heading } from "#src/database/models/Heading.model.js";
import { TYPES } from "#src/di/types.js";
import { headingParser } from "#src/features/markdown/parsing/heading.parser.js";
import { MdxParser } from "#src/features/markdown/parsing/mdx.parser.js";
import { getSlug } from "#src/utils/slugging/getSlug.js";
import { RedisImpl } from "#src/redis/redis.impl.js";
import { ArticleServiceAbstract } from "#src/types/abstractions/services/article.service.abstraction.js";
import { ArticleContent } from "#src/types/interfaces/articles/ArticleContent.js";
import { ArticlePreview } from "#src/types/interfaces/articles/ArticlePreview.js";
import { TypeofArticleFiltersSchema } from "#src/types/schemas/article/ArticleFilters.schema.js";
import { TypeofAdvancedArticleSchema } from "#src/types/schemas/article/ArticlePatch.schema.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";
import { RethrowApiError } from "#src/utils/ApiError/RethrowApiError.js";
import { cleanup } from "#src/utils/helper/object.cleanup.js";
import { sanitizeMarkdownToText } from "#src/utils/sanitize/markdown.js";
import { TypeofArticleUpdateSchema } from "#src/types/schemas/article/ArticleUpdate.schema.js";

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
            const where: any = {}

            if (filters.title) {
                where.title = { [Op.iLike]: `%${filters.title}%` }
            }

            if (filters.author_username && filters.author_username !== 'Не указан') {
                where.author_username = { [Op.iLike]: `%${filters.author_username}%` }
            }

            if (filters.event_start_date) {
                where.event_start_date = { [Op.gte]: new Date(filters.event_start_date) }
            }

            if (filters.event_end_date) {
                where.event_end_date = { [Op.lte]: new Date(filters.event_end_date) }
            }

            if (Object.keys(where).length === 0) throw ApiError.BadRequest('Invalid filter params')

            const articles = await Article.findAll({
                where,
                attributes: [
                    'id', 
                    'title', 
                    'slug', 
                    'author_username', 
                    'event_start_date', 
                    'event_end_date'
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
            const cleanedContent = sanitizeMarkdownToText(content)

            if (!cleanedContent) throw ApiError.BadRequest(`Invalid content`)

            const article = await Article.findOne({
                where: { content_markdown: { [Op.iLike]: `%${cleanedContent}%` } },
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

            const processedHeadings  = headingParser(options.content_markdown)
            headings?.forEach((heading) => processedHeadings.push(heading.title))
            processedHeadings.push(articleOpt.title)

            const content_html = await MdxParser(options.content_markdown)

            const article = await Article.create({
                ...articleOpt,
                slug,
                content_markdown
            }, { transaction })

            await Promise.all(
                processedHeadings.map(async (heading) => {
                    try {
                        console.log(heading)

                        await Heading.create({
                            title: heading,
                            article_id: article.id,
                        }, { transaction })
                    } catch (e) {
                        throw ApiError.BadRequest(`Error while creating heading: ${heading}`, undefined, e)
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

    async updateArcticle(id: number, options: TypeofArticleUpdateSchema): Promise<{ article: Article, headings: Heading[] | null }> {
        const transaction = await this.sequelize.transaction()
        try {
            const { content_markdown, headings, ...articleOpt } = options

            const article = await Article.findByPk(id)
            if (!article) throw ApiError.NotFound(`Article with id: ${id} not found`)

            const slug = options.title ? getSlug(options.title) : undefined
            headings.push({title: options.title ?? article.title})

            const updateData = cleanup({ ...articleOpt, slug, content_markdown })
            if (Object.keys(updateData).length === 0) throw ApiError.BadRequest('Nothing to update. Request data is empty');

            await Article.update(updateData, { where: { id }, transaction });

            if (content_markdown) {
                const content_html = await MdxParser(content_markdown)
                const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${id}`])
                this.redis.setValue(key, content_html)

                const processedHeadings = headingParser(content_markdown)
                processedHeadings.forEach((head) => headings?.push({title: head}))
            }

            if (headings || content_markdown) {
                await this.updateHeadings(article.id, headings, transaction)
            }

            await article.reload({ transaction })
            await transaction.commit()

            const newHeadings = await Article.findByPk(id, { attributes: [], include: [{ model: Heading, as: 'headings', attributes: ['id', 'title'] }] })
            return { article: article, headings: newHeadings?.headings ?? null }
        } catch (e) {
            await transaction.rollback()
            RethrowApiError(`Service error: Method - updateArcticle`, e)
        }
    }

    async bulkDeleteArticles(ids: number[]): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(ids.length / 2), 1);
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

    /**
     * 
     * @param id - Article ID
     * @param headings - New headings
     * @param transaction - Sequelize transaction
    */
    private async updateHeadings(id: number, headings: { title: string }[], transaction?: Transaction) {
        const existingHeadings = await Article.findByPk(id, {
            attributes: [],
            include: [
                {
                    model: Heading,
                    as: 'headings',
                    attributes: ['id', 'title'],
                }
            ]
        })

        const newHeadings = headings.map(h => h.title)
        const existingHeadingsTitles = existingHeadings?.headings?.map(h => h.title) ?? []

        const headingsToDelete = existingHeadingsTitles.filter(t => !newHeadings.includes(t))
        const headingsToLeave = existingHeadingsTitles.filter(t => newHeadings.includes(t))
        const headingsToCreate = newHeadings.filter(heading => !headingsToLeave.some(h => h === heading))

        await Promise.all(
            headingsToDelete.map(heading => {
                return Heading.destroy({
                    where: {
                        title: heading
                    }, transaction
                })
            }) ?? []
        )

        await Promise.all(
            headingsToCreate.map(heading => {
                return Heading.create({
                    title: heading,
                    article_id: id
                }, { transaction })
            }) ?? []
        )
    }
}