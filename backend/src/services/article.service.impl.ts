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
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface";
import { createDir } from "#src/utils/fileHandlers/create/createDir";
import { moveFileToFinal } from "#src/utils/fileHandlers/moveFileToFinal";
import { ArticleFile } from "#src/database/models/ArticleFiles.model";
import { removeFile } from "#src/utils/fileHandlers/remove/removeFile";
import { generateUuid } from "#src/utils/fileHandlers/generateUuid";
import { ArticleFileInfo } from "#src/types/interfaces/files/ArticleFileInfo.interface";
import { fileParser } from "#src/features/markdown/parsing/file.parser";
import { removeDir } from "#src/utils/fileHandlers/remove/removeDir";
import { UPLOAD_BASE } from "#src/utils/fileHandlers/config";

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

    async createArticle(options: TypeofAdvancedArticleSchema, fileConfig: FileConfig | undefined): Promise<Article> {
        const transaction = await this.sequelize.transaction()
        try {
            const article = await this._createArticleRecord(options, transaction)
            const extractedFiles: string[] = fileParser(options.content_markdown)
            const savedFiles = fileConfig ? await this._processFiles(fileConfig, article.id, extractedFiles, transaction) : []
            const contentHtml = await this._renderMarkdownWithFiles(options.content_markdown, savedFiles)

            await this._createHeadings(options, article.id, transaction)
            await this._cacheHtml(article.id, contentHtml)

            await transaction.commit()
            return article
        } catch (e) {
            await transaction.rollback()
            RethrowApiError(`Service error: Method - createArticle`, e)
        }
    }


    //нужно предусмотреть ситуацию, когда файл будет указан в разметке, но не прикреплен. Такой нужно удалять из разметки
    async updateArcticle(
        id: number,
        options: TypeofArticleUpdateSchema,
        fileConfig: FileConfig | undefined
    ): Promise<{ article: Article, headings: Heading[] | null }> {
    const transaction = await this.sequelize.transaction();
    try {
        const article = await this._findArticleWithFiles(id);
        const updateData = this._prepareUpdateData(options, article);
        
        if (Object.keys(updateData).length) {
            await Article.update(updateData, { where: { id }, transaction });
        }

        const extractedFiles = fileParser(options.content_markdown ?? article.content_markdown);
        
        if (options.files?.delete?.length) {
            await this._deleteFiles(options.files.delete, transaction);
        }

        const savedFiles = fileConfig
            ? await this._processFiles(fileConfig, id, extractedFiles, transaction)
            : [];

        const filesForMarkdown = this._getFilesForMarkdown(article.files || [], options);
        savedFiles.push(...filesForMarkdown);

        if (options.content_markdown) {
            const contentHtml = await MdxParser(options.content_markdown, savedFiles);
            await this._cacheHtml(article.id, contentHtml);

            const processedHeadings = headingParser(options.content_markdown);
            options.headings?.push(...processedHeadings.map(h => ({ title: h })));
        }

        if (options.headings || options.content_markdown) {
            await this._updateHeadings(article.id, options.headings ?? [], transaction);
        }

        await article.reload({ transaction });
        await transaction.commit();

        const newHeadings = await this._getArticleHeadings(id);
        return { article, headings: newHeadings };
    } catch (e) {
        await transaction.rollback();
        RethrowApiError(`Service error: Method - updateArcticle`, e);
    }
    }

    async bulkDeleteArticles(ids: number[]): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(ids.length / 2), 1);
        let errorCounter = 0;
    
        try {
           for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) break
                    
                    const article = await Article.findByPk(id)
                    if (!article) throw ApiError.NotFound(`Article with id: ${id} do not exists`)

                    await this.sequelize.transaction(async (t) => {
                        await Article.destroy({
                            where: { id },
                            transaction: t
                        })
                    })

                    this._deleteRedisValue(id)

                    removeDir(UPLOAD_BASE + `/final/articles/${id}`)
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

    private async _createArticleRecord(
        options: TypeofAdvancedArticleSchema,
        transaction: Transaction
    ): Promise<Article> {
        const { content_markdown, headings, ...articleOpt } = options
        const slug = getSlug(articleOpt.title)

        return await Article.create({
            ...articleOpt,
            slug,
            content_markdown
        }, { transaction })
    }

    private async _createHeadings(
        options: TypeofAdvancedArticleSchema,
        articleId: number,
        transaction: Transaction
    ) {
        const processedHeadings = headingParser(options.content_markdown)
        options.headings?.forEach(h => processedHeadings.push(h.title))
        processedHeadings.push(options.title)

        await Promise.all(
            processedHeadings.map(h => Heading.create({ title: h, article_id: articleId }, { transaction }))
        )
    }

        /**
     * 
     * @param id - Article ID
     * @param headings - New headings
     * @param transaction - Sequelize transaction
    */
    private async _updateHeadings(
        id: number, 
        headings: { title: string }[], 
        transaction?: Transaction
    ): Promise<void> {
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

    private async _processFiles(fileConfig: FileConfig, articleId: number, extractedFiles: string[], transaction: Transaction): Promise<ArticleFileInfo[]> {
        const dirpath = createDir(String(articleId))
        const savedFiles: ArticleFileInfo[] = []

        for (const file of fileConfig.files || []) {
            if (!extractedFiles.some(f => f.toLowerCase() === file.filename.toLowerCase())) continue
            const uuid = generateUuid()
            try {
                const imageUrl = moveFileToFinal(fileConfig.tempDirPath, file.filename, `articles/${articleId}`, uuid)
                console.log(file.filename)
                await ArticleFile.create({
                    article_id: articleId,
                    path: imageUrl,
                    originalName: file.filename
                }, { transaction })

                console.log(imageUrl)
                savedFiles.push({ originalName: file.filename, path: imageUrl! })
                console.log(savedFiles)
            } catch (e) {
                console.log(`File ${file.filename} was removed`, e)
                removeFile(uuid, dirpath)
            }
        }

        removeDir(fileConfig.tempDirPath)

        return savedFiles
    }

    private async _renderMarkdownWithFiles(markdown: string, savedFiles: ArticleFileInfo[]): Promise<string> {
        return await MdxParser(markdown, savedFiles)
    }

    private async _deleteRedisValue(articleId: number) {
        const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${articleId}`])
        await this.redis.deleteValue(key)
    }

    private async _cacheHtml(articleId: number, html: string) {
        const key = this.redis.joinKeys([redisIdPrefixes.content_html, `${articleId}`])
        await this.redis.setValue(key, html)
    }

    private async _findArticleWithFiles(id: number) {
        const article = await Article.findByPk(id, {
            include: [{ model: ArticleFile, as: 'files', attributes: ['id', 'path', 'originalName'] }]
        });
        if (!article) throw ApiError.NotFound(`Article with id: ${id} not found`);
        return article;
    }

    private _prepareUpdateData(options: TypeofArticleUpdateSchema, article: Article) {
        const { content_markdown, headings, ...articleOpt } = options;
        const slug = options.title ? getSlug(options.title) : undefined;
        headings?.push({ title: options.title ?? article.title });
        return cleanup({ ...articleOpt, slug, content_markdown });
    }

    private async _deleteFiles(fileIds: number[], transaction: any) {
        for (const id of fileIds) {
            const file = await ArticleFile.findByPk(id);
            if (!file) continue;
            await ArticleFile.destroy({ where: { id }, transaction });
            removeFile('', '', file.path);
        }
    }

    private _getFilesForMarkdown(files: ArticleFile[], options: TypeofArticleUpdateSchema): ArticleFileInfo[] {
        return files
            .filter(f => !options.files?.delete?.includes(f.id))
            .map(f => ({ path: f.path, originalName: f.originalName }));
    }

    private async _getArticleHeadings(id: number) {
        const result = await Article.findByPk(id, {
            attributes: [],
            include: [{ model: Heading, as: 'headings', attributes: ['id', 'title'] }]
        });
        return result?.headings ?? null;
    }
}