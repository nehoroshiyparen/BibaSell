import { DatabaseImpl } from "#src/database/database.impl.js";
import { PdfArticle } from "#src/database/models/PdfArticle/PdfArticle.model.js";
import { PdfArticleSequelizeRepo } from "#src/database/repositories/pdfArticle.sequelize-repo.js";
import { TYPES } from "#src/di/types.js";
import { PdfArticleElasticRepo } from "#src/elastic/repositories/pdfArticle.elastic-repo.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { Status } from "#src/types/interfaces/http/Status.interface.js";
import { TypeofPdfArticleFiltersSchema } from "#src/types/schemas/pdfArticle/PdfArticleFilters.schema.js";
import { TypeofPdfArticleFullSchema } from "#src/types/schemas/pdfArticle/PdfArticleFull.schema.js";
import { TypeofPdfArticlePatchSchema } from "#src/types/schemas/pdfArticle/PdfArticlePatch.schema.js";
import { TypeofPdfAcrticlePreviewSchema } from "#src/types/schemas/pdfArticle/PdfArticlePreview.schema.js";
import { TypeofPdfArticleUpdateSchema } from "#src/types/schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";
import { RethrowApiError } from "#src/utils/ApiError/RethrowApiError.js";
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

    async getArticles(offset: number = 0, limit: number = 10): Promise<TypeofPdfAcrticlePreviewSchema> {
        try {
            const articles = await this.sequelize.findAll(offset, limit)
            return articles
        } catch (e) {
            RethrowApiError('Service error: Method - getArticles', e)
        }
    }

    async getFilteredArticles(
        filters: TypeofPdfArticleFiltersSchema,
        offset?: number,
        limit?: number,
    ): Promise<TypeofPdfAcrticlePreviewSchema> {
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
                sequelizeCandidates = await this.sequelize.findByAuthors(sequelizeAuthor)
            }

            // Если фильтры есть для обеих баз — делаем пересечение по id
            let finalResults: PdfArticle[]
            if (elasticCandidates.length && sequelizeCandidates.length) {
                const sequelizeIds = new Set(sequelizeCandidates.map(a => a.id))
                finalResults = elasticCandidates.filter(a => sequelizeIds.has(a.id))
            } else if (elasticCandidates.length) {
                finalResults = elasticCandidates
            } else if (sequelizeCandidates.length) {
                finalResults = sequelizeCandidates
            } else {
                finalResults = []
            }

            return finalResults
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
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - deleteArticle', e)
        }
    }

    async bulkDeleteArticles(ids: number[]): Promise<Status> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - bulkDeleteArticles', e)
        }
    }
}