import { TYPES } from "#src/di/types.js";
import { TypeofPdfArticlePatchSchema } from "../schemas/pdfArticle/PdfArticlePatch.schema.js";
import { inject, injectable } from "inversify";
import { Model, Sequelize, Transaction, where, WhereOptions } from "sequelize";
import { IDatabase } from "#src/types/contracts/index.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfArticleUpdateSchema } from "../schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Author } from "#src/infrastructure/sequelize/models/Author/Author.model.js";
import { PdfArticleUpdateDto } from "../types/dto/PdfArticleUpdate.dto.js";

@injectable()
export class PdfArticleSequelizeRepo {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: IDatabase
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async create(data: TypeofPdfArticlePatchSchema & { extractedText: string, key: string }, transaction?: Transaction): Promise<PdfArticle> {
        const article =  await PdfArticle.create({
            title: data.title,
            publishedAt: new Date(),
            key: data.key,
            extractedText: data.extractedText
        }, { transaction })
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
        return article as PdfArticle & { authors: Author[] } | null
    }

    async findByIds(ids: number[], offset = 0, limit = 10): Promise<PdfArticle[]> {
        const articles = await PdfArticle.findAll({
            where: { id: ids },
            offset,
            limit
        })
        return articles
    }

    async findAll(offset?: number, limit?: number, where?: WhereOptions<any>): Promise<PdfArticle[]> {
        const articles = await PdfArticle.findAll({ 
            offset, 
            limit, 
            where,
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

    async destroy(id: number | number[], transaction?: Transaction) {
        await PdfArticle.destroy({ where: { id }, transaction  })
    }

    async createTransaction(): Promise<Transaction> {
        return await this.sequelize.transaction()
    }
}