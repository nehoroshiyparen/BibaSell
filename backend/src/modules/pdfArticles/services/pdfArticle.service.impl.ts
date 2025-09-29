import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { PdfArticleSequelizeRepo } from "#src/modules/pdfArticles/repositories/pdfArticle.sequelize-repo.js";
import { TYPES } from "#src/di/types.js";
import { PdfArticleElasticRepo } from "#src/modules/pdfArticles/repositories/pdfArticle.elastic-repo.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { Status } from "#src/types/interfaces/http/Status.interface.js";
import { TypeofPdfArticleFiltersSchema } from "../schemas/pdfArticle/PdfArticleFilters.schema.js"; 
import { TypeofPdfArticleFullSchema } from "../schemas/pdfArticle/PdfArticleFull.schema.js";
import { TypeofPdfArticlePatchSchema } from "../schemas/pdfArticle/PdfArticlePatch.schema.js";
import { TypeofPdfAcrticlePreviewSchema } from "../schemas/pdfArticle/PdfArticlePreview.schema.js";
import { TypeofPdfArticleUpdateSchema } from "../schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { arrayToPdfArticlePreview } from "#src/modules/pdfArticles/utils/mappings/arrayToPreview.js";
import { inject, injectable } from "inversify";

@injectable()
export class PdfArticleServiceImpl implements IPdfArticleService {
    constructor(
       @inject(TYPES.PdfArticleSequelizeRepo) private sequelize: PdfArticleSequelizeRepo,
       @inject(TYPES.PdfArticleElasticRepo) private elastic: PdfArticleElasticRepo
    ) {}

    async getArticleById(id: number): Promise<TypeofPdfArticleFullSchema> {
        try {
            const article = await this.sequelize.findBypk(id)
            if (!article) throw ApiError.NotFound(`Article with id: ${id} was not found`)
            return article
        } catch (e) {
            RethrowApiError('Service error: Method - getArticleById', e)
        }
    }

    async getArticles(offset: number = 0, limit: number = 10): Promise<TypeofPdfAcrticlePreviewSchema[]> {
        try {
            const articles = await this.sequelize.findAll(offset, limit)
            return arrayToPdfArticlePreview(articles)
        } catch (e) {
            RethrowApiError('Service error: Method - getArticles', e)
        }
    }

    async getFilteredArticles(
        filters: TypeofPdfArticleFiltersSchema,
        offset?: number,
        limit?: number,
    ): Promise<TypeofPdfAcrticlePreviewSchema[]> {
        try {
            const elasticQuery: Record<string, string> = {}
            if (filters.title) elasticQuery.title = filters.title
            if (filters.extractedText) elasticQuery.extractedText = filters.extractedText

            const sequelizeAuthor = filters.author || null

            let elasticCandidates: PdfArticle[] = []
            let sequelizeCandidates: PdfArticle[] = []

            if (Object.keys(elasticQuery).length) {
                elasticCandidates = await this.elastic.searchArticles(elasticQuery, offset, limit)
            }

            if (sequelizeAuthor) {
                sequelizeCandidates = await this.sequelize.findByAuthor(sequelizeAuthor, offset, limit)
            }

            let compaired: PdfArticle[]
            if (elasticCandidates.length && sequelizeCandidates.length) {
                const sequelizeIds = new Set(sequelizeCandidates.map(a => a.id))
                compaired = elasticCandidates.filter(a => sequelizeIds.has(a.id))
            } else if (elasticCandidates.length) {
                compaired = elasticCandidates
            } else if (sequelizeCandidates.length) {
                compaired = sequelizeCandidates
            } else {
                compaired = []
            }

            const results = await Promise.all(
                compaired.map(a => this.sequelize.findBypk(a.id))
            )

            return arrayToPdfArticlePreview(results)
        } catch (e) {
            RethrowApiError('Service error: Method - getFilteredArticles', e)
        }
    }

    async createArticle(
        options: TypeofPdfArticlePatchSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - createArticle', e)
        }
    }

    async updateArticle(
        otpions: TypeofPdfArticleUpdateSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - updateArticle', e)
        }
    }

    async deleteArticle(id: number): Promise<Status> {
        const transaction = await this.sequelize.createTransaction()
        try {
            await this.sequelize.destroy(id, transaction)
            try {
                await this.elastic.destroyArticle(id)
            } catch (e) {
                throw ApiError.Internal(`Elastic delete failed. Rollback sequelize chenges`, `ELASTIC_INTERNAL_ERROR`, e)
            }

            await transaction.commit()

            return { status: 200 }
        } catch (e) {
            await transaction.rollback()
            RethrowApiError('Service error: Method - deleteArticle', e)
        }
    }

    async bulkDeleteArticles(ids: number[]): Promise<Status> {
        const errorLimit = Math.max(Math.floor(ids.length / 2), 1)
        let errorCounter = 0

        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) break

                    await this.deleteArticle(id)
                } catch (e) {
                    errorCounter++
                    console.log(`Error while deleting article with id: ${id} \n Error: ${e}`)
                }
            }

            if (errorCounter > 0 && errorCounter < errorLimit) {
                return { status: 206 }
            } else if (errorCounter >= errorLimit) {
                return { status: 400 }
            }

            return { status: 200 }
        } catch (e) {
            RethrowApiError('Service error: Method - bulkDeleteArticles', e)
        }
    }
}