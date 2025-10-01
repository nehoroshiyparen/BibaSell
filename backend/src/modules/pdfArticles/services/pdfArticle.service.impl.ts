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
import { S3PdfArticleService } from "./s3.service.impl.js";
import { getSlug } from "#src/shared/slugging/getSlug.js";
import { pdfParse } from "#src/shared/fileUtils/pdf-parse.js";
import { cleanup } from "#src/shared/helper/object.cleanup.js";
import { PdfArticleUpdateDto } from "../types/dto/PdfArticleUpdate.dto.js";
import { generateUuid } from "#src/shared/fileUtils/generateUuid.js";

@injectable()
export class PdfArticleServiceImpl implements IPdfArticleService {
    constructor(
       @inject(TYPES.PdfArticleSequelizeRepo) private sequelize: PdfArticleSequelizeRepo,
       @inject(TYPES.PdfArticleElasticRepo) private elastic: PdfArticleElasticRepo,
       @inject(TYPES.S3PdfArticleService) private s3: S3PdfArticleService,
    ) {}

    async getArticleById(id: number): Promise<TypeofPdfArticleFullSchema> {
        try {
            const article = await this.sequelize.findById(id)
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

            const author = filters.author || null

            let idsFromElastic: number[] = []
            if (Object.keys(elasticQuery).length) {
                const elasticCandidates = await this.elastic.searchArticles(elasticQuery)
                idsFromElastic = elasticCandidates.map(a => a.id)
            }

            let articles: PdfArticle[] = []

            if (author && idsFromElastic.length) {
                articles = await this.sequelize.findByAuthorAndIds(author, idsFromElastic, offset, limit)
            } else if (author) {
                articles = await this.sequelize.findByAuthor(author, offset, limit)
            } else if (idsFromElastic.length) {
                articles = await this.sequelize.findByIds(idsFromElastic, offset, limit)
            } else {
                articles = await this.sequelize.findAll(offset, limit)
            }

            return arrayToPdfArticlePreview(articles)
        } catch (e) {
            RethrowApiError('Service error: Method - getFilteredArticles', e)
        }
    }

    async createArticle(
        options: TypeofPdfArticlePatchSchema, 
        fileConfig: FileConfig
    ): Promise<TypeofPdfArticleFullSchema> {
        const transaction = await this.sequelize.createTransaction()
        const S3Key = generateUuid()

        try {
            const file = fileConfig.files[0] as Express.Multer.File

            await this.s3.uploadArticle(S3Key, file.buffer)
            const extractedText = await pdfParse(file.buffer, fileConfig.tempDirPath)

            const article = await this.sequelize.create({ ...options, key: S3Key, extractedText: extractedText }, transaction)
            await this.elastic.indexArticle(article)

            await transaction.commit()
            return { key: S3Key }
        } catch (e) {
            try {
                await this.s3.deleteArticle(S3Key)
            } catch {}
            await transaction.rollback()
            RethrowApiError('Service error: Method - createArticle', e)
        }
    }

    async updateArticle(
        options: TypeofPdfArticleUpdateSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema> {
        const transaction = await this.sequelize.createTransaction()
        let oldFileBuffer: Buffer | null = null
        let needToRollbackElastic: boolean = false

        const article = await this.sequelize.findById(options.id)
        if (!article) throw ApiError.NotFound(`Article with id: ${options.id} is not found`)

        try {           
            const slug = getSlug(options.title)
            const optionsToUpdate: Partial<PdfArticleUpdateDto> = cleanup({
                title: options.title,
                slug
            }) as Partial<PdfArticleUpdateDto>

            const updatedArticle = await this.sequelize.update(options.id, optionsToUpdate, transaction)

            needToRollbackElastic = true
            await this.elastic.indexArticle(updatedArticle)

            if (fileConfig && fileConfig?.files.length !== 0) {
                oldFileBuffer = await this.s3.getArticle(article.key)
                const file = fileConfig.files[0]
                await this.s3.uploadArticle(updatedArticle.key, file.buffer)
            }

            await transaction.commit()
            return updatedArticle
        } catch (e) {
            await transaction.rollback()
            if (needToRollbackElastic) await this.rollbackElasticChanges(article)
            if (oldFileBuffer) await this.rollbackS3Changes(article, oldFileBuffer)
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

    private async rollbackElasticChanges(oldArticle: PdfArticle) {
        try {
            await this.elastic.indexArticle(oldArticle)
        } catch (e) {
            throw ApiError.Internal(`Failed to rollback changes in Elastic, while updating Pdf Article with id: ${oldArticle.id}`, undefined, e)
        }
    }

    private async rollbackS3Changes(oldArticle: PdfArticle, oldFileBuffer: Buffer) {
        try {
            await this.s3.uploadArticle(oldArticle.key, oldFileBuffer)
        } catch (e) {
            throw ApiError.Internal(`Failed to rollback changes in S3, while updating Pdf Article with id: ${oldArticle.id}`)
        }
    }
}