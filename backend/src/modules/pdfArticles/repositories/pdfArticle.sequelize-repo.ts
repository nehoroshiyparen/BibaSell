import { TYPES } from "#src/di/types.js";
import { TypeofPdfArticlePatchSchema } from "../schemas/pdfArticle/PdfArticlePatch.schema.js";
import { inject, injectable } from "inversify";
import { Model, Sequelize, Transaction, where } from "sequelize";
import { IDatabase } from "#src/types/contracts/index.js";
import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { TypeofPdfArticleUpdateSchema } from "../schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Author } from "#src/infrastructure/sequelize/models/Author/Author.model.js";

@injectable()
export class PdfArticleSequelizeRepo {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: IDatabase
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async create(data: TypeofPdfArticlePatchSchema): Promise<PdfArticle> {
        const article =  await PdfArticle.create(data)
        return article
    }

    async findBypk(id: number): Promise<PdfArticle | null> {
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

    async findAll(offset: number, limit: number): Promise<PdfArticle[]> {
        const articles = await PdfArticle.findAll({ 
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

    async findByAuthor(authorName: string, offset?: number, limit?: number): Promise<PdfArticle[]> {
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

    async update(id: number, data: TypeofPdfArticleUpdateSchema): Promise<PdfArticle> {
        const article = await PdfArticle.findByPk(id)
        if (!article) throw ApiError.NotFound(`Article with id: ${id} is not exists`)

        return await article.update(data)
    }

    async destroy(id: number, transaction?: Transaction) {
        await PdfArticle.destroy({ where: { id }, transaction  })
    }

    async createTransaction(): Promise<Transaction> {
        return await this.sequelize.transaction()
    }

    private async isExists(id: number): Promise<boolean> {
        const article = await PdfArticle.findByPk(id)
        return !!article
    }
}