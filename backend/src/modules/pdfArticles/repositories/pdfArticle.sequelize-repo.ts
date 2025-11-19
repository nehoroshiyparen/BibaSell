import { TYPES } from "#src/di/types.js";
import { TypeofPdfArticlePatchSchema } from "../schemas/pdfArticle/PdfArticlePatch.schema.js";
import { inject, injectable } from "inversify";
import { FindOptions, Model, Sequelize, Transaction, where, WhereOptions } from "sequelize";
import { IDatabase } from "#src/types/contracts/index.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfArticleUpdateSchema } from "../schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Author } from "#src/infrastructure/sequelize/models/Author/Author.model.js";
import { PdfArticleUpdateDto } from "../types/dto/PdfArticleUpdate.dto.js";
import { BaseSequelizeRepo } from "#src/infrastructure/sequelize/base.sequelize-repo.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { PdfArticleAuthors } from "#src/infrastructure/sequelize/models/Associations/PdfArticleAuthors.model.js";

@injectable()
export class PdfArticleSequelizeRepo extends BaseSequelizeRepo<PdfArticle> {
    constructor(
        @inject(TYPES.Database) private database: IDatabase,
        @inject(TYPES.SequelizeLogger) protected logger: StoreLogger
    ) {
        super(database.getDatabase(), PdfArticle, logger)
    }

    async create(
        data: TypeofPdfArticlePatchSchema & { extractedText: string, key: string, slug: string, preview_key: string | null, defaultPreview: string }, 
        transaction?: Transaction
    ): Promise<PdfArticle> {
        const article =  await PdfArticle.create({
            title: data.title,
            publishedAt: new Date(),
            slug: data.slug,
            key: data.key,
            preview_key: data.preview_key,
            defaultPreview: data.defaultPreview,
            extractedText: data.extractedText
        }, { transaction })

        if (data.authors && data.authors.length > 0) {
            const authors = await Promise.all(
                data.authors.map(name => Author.create({ name }, { transaction }))
            )

            const articleAuthors = authors.map(author => ({
                author_id: author.id,
                pdfArticle_id: article.id
            }))

            await PdfArticleAuthors.bulkCreate(articleAuthors, { transaction })
        }

        return article
    }

    async findById(id: number): Promise<PdfArticle | null> {
        const article = await PdfArticle.findByPk(id, { 
            include: 
                [ 
                    { 
                        model: Author,
                        as: 'authors',
                    } 
                ]
        })
        return article
    }

    async findByIds(ids: number[], offset = 0, limit = 10): Promise<PdfArticle[]> {
        const articles = await PdfArticle.findAll({
            where: { id: ids },
            offset,
            limit,
            include: 
                [ 
                    { 
                        model: Author,
                        as: 'authors',
                    } 
                ]            
        })
        return articles
    }

    async findByAuthor(authorName: string, offset = 0, limit = 10): Promise<PdfArticle[]> {
        const articles = await PdfArticle.findAll({
            include: [
                {
                    model: Author,
                    as: 'authors',
                    where: { name: authorName }
                }
            ]
        })
        return articles
    }

    async findByAuthorAndIds(author: string, ids: number[], offset = 0, limit = 10): Promise<PdfArticle[]> {
        const articles = await PdfArticle.findAll({
            where: {
                id: ids,
                author: author
            },
            offset,
            limit
        })
        return articles
    }

    async update(id: number, data: PdfArticleUpdateDto, transaction?: Transaction): Promise<PdfArticle> {
        const article = await PdfArticle.findByPk(id)
        if (!article) throw ApiError.NotFound(`Article with id: ${id} is not exists`)

        return await article.update({ ...data, updatedAt: new Date() }, { transaction })
    }

    protected getFindByIdOptions(): FindOptions | undefined {
        return {
            include: 
                [ 
                    { 
                        model: Author,
                        as: 'authors',
                    } 
                ]
        }
    }

    protected getFindBySlugOptions(): FindOptions | undefined {
        return {
            include: 
                [ 
                    { 
                        model: Author,
                        as: 'authors',
                    } 
                ]
        }
    }

    protected getFindAllOptions(): FindOptions | undefined {
        return {
            include: 
                [ 
                    { 
                        model: Author,
                        as: 'authors',
                    } 
                ] 
        }
    }
}