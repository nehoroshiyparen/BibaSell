import { PdfArticle } from "#src/infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js";
import { PdfArticleSequelizeRepo } from "#src/modules/pdfArticles/repositories/pdfArticle.sequelize-repo.js";
import { TYPES } from "#src/di/types.js";
import { PdfArticleElasticRepo } from "#src/modules/pdfArticles/repositories/pdfArticle.elastic-repo.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { TypeofPdfArticleFiltersSchema } from "../schemas/pdfArticle/PdfArticleFilters.schema.js"; 
import { TypeofPdfArticleFullSchema } from "../schemas/pdfArticle/PdfArticleFull.schema.js";
import { TypeofPdfArticlePatchSchema } from "../schemas/pdfArticle/PdfArticlePatch.schema.js";
import { TypeofPdfAcrticlePreviewSchema } from "../schemas/pdfArticle/PdfArticlePreview.schema.js";
import { TypeofPdfArticleUpdateSchema } from "../schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { inject, injectable } from "inversify";
import { getSlug } from "#src/shared/slugging/getSlug.js";
import { pdfParse } from "#src/shared/files/pdf/pdf-parse.js";
import { cleanup } from "#src/shared/utils/object.cleanup.js";
import { PdfArticleUpdateDto } from "../types/dto/PdfArticleUpdate.dto.js";
import { generateUuid } from "#src/shared/crypto/generateUuid.js";
import { S3PdfArticleServiceImpl } from "./S3PdfArticle.service.impl.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { ErrorStack } from "#src/types/interfaces/http/ErrorStack.interface.js";
import { readFile } from "#src/shared/files/utils/readFile.js";
import { removeDir } from "#src/shared/files/remove/removeDir.js";
import { pdf2pic } from "#src/shared/files/pdf/pdf2pic.js";
import { PdfArticleMapper } from "../mappers/pdfArticle.mapper.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js";
import { getRelativePath } from "#src/shared/files/utils/getRelativePath.js";
import { getRandomCover } from "../utils/files/getRandomCover.js";
import { TypeofUpdateOptionsSchema } from "../schemas/options/UpdateOptionsSchema.js";

@injectable()
export class PdfArticleServiceImpl implements IPdfArticleService {
    constructor(
       @inject(TYPES.PdfArticleSequelizeRepo) private sequelize: PdfArticleSequelizeRepo,
       @inject(TYPES.PdfArticleElasticRepo) private elastic: PdfArticleElasticRepo,
       @inject(TYPES.S3PdfArticleService) private s3: S3PdfArticleServiceImpl,
       @inject(TYPES.PdfArticleMapper) private mapper: PdfArticleMapper,
    ) {}

    async getById(id: number): Promise<TypeofPdfArticleFullSchema> {
        try {
            const article = await this.sequelize.findById(id)
            if (!article) throw ApiError.NotFound(`Article with id: ${id} was not found`)
            return await this.mapper.toFull(article)
        } catch (e) {
            RethrowApiError('Service error: Method - getArticleById', e)
        }
    }

    async getBySlug(slug: string): Promise<TypeofPdfArticleFullSchema> {
        try {
            const article = await this.sequelize.findBySlug(slug)
            if (!article) throw ApiError.NotFound(`Article with slug: ${slug} was not found`)
            return await this.mapper.toFull(article)
        } catch (e) {
            RethrowApiError('Service error: ', e)
        }
    }

    async getList(offset: number = 0, limit: number = 10): Promise<TypeofPdfAcrticlePreviewSchema[]> {
        try {
            const articles = await this.sequelize.findAll(offset, limit)
            return await this.mapper.toPreview(articles)
        } catch (e) {
            RethrowApiError('Service error: Method - getArticles', e)
        }
    }

    async getFiltered(
        filters: TypeofPdfArticleFiltersSchema,
        offset = 0,
        limit = 10,
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

            return await this.mapper.toPreview(articles)
        } catch (e) {
            RethrowApiError('Service error: Method - getFilteredArticles', e)
        }
    }

    async create(
        options: TypeofPdfArticlePatchSchema,
        fileConfig: FileConfig
    ): Promise<TypeofPdfArticleFullSchema> {
        const transaction = await this.sequelize.createTransaction()
        const pdfKey = generateUuid()
        const previewKey = generateUuid()

        try {
            const pdfFile = fileConfig.files.pdf as Express.Multer.File
            const pdfBuffer = await readFile(pdfFile.path)

            const previewFile = fileConfig.files.preview as Express.Multer.File
            const previewBuffer = previewFile ? await readFile(previewFile.path) : undefined

            const extractedText = await pdfParse(pdfBuffer)

            if (!options.title) throw ApiError.BadRequest("Article must have a title")
            const slug = getSlug(options.title)

            const article = await this.sequelize.create({
                ...options,
                slug: slug!,
                key: pdfKey,
                preview_key: previewFile ? previewKey : null,
                defaultPreview: getRandomCover(),
                extractedText,
            }, transaction)

            await this.elastic.indexArticle(article)
            previewBuffer && await this.s3.upload(previewKey, previewBuffer, { prefix: "article_previews/" })
            await this.s3.upload(pdfKey, pdfBuffer)

            await this.sequelize.commitTransaction(transaction)
            removeDir(fileConfig.tempDirPath)

            return await this.mapper.toFull(article)
        } catch (err) {
            try {
                await this.s3.delete(pdfKey)
                await this.s3.delete(previewKey, "article_previews/")
            } catch {}
            fileConfig && removeDir(fileConfig.tempDirPath)
            await this.sequelize.rollbackTransaction(transaction)
            RethrowApiError("Service error: Method - createArticle", err)
        }
    }

    async update(
        id: number,
        options: TypeofPdfArticleUpdateSchema, 
        fileConfig: FileConfig
    ): Promise<TypeofPdfArticleFullSchema> {
        const transaction = await this.sequelize.createTransaction()
        let oldFileBuffer: Buffer | null = null
        let needToRollbackElastic: boolean = false

        const article = await this.sequelize.findById(id)
        if (!article) throw ApiError.NotFound(`Article with id: ${id} is not found`)

        try {         
            const pdfFile = fileConfig.files.pdf as Express.Multer.File
            const previewFile = fileConfig.files.preview as Express.Multer.File
            
            const slug = options.title ? getSlug(options.title as string) : undefined
            const optionsToUpdate: Partial<PdfArticleUpdateDto> = cleanup({
                title: options.title,
                slug
            }) as Partial<PdfArticleUpdateDto>

            const updatedArticle = await this.sequelize.update(id, optionsToUpdate, transaction)

            await this.elastic.indexArticle(updatedArticle)
            needToRollbackElastic = true

            if (pdfFile) {
                const pdfKey = generateUuid()
                const pdfBuffer = await readFile(pdfFile.path) 
                await this.s3.upload(updatedArticle.key, pdfBuffer)
                await this.s3.delete(article.key, 'articles/')

                await this.sequelize.update(
                    updatedArticle.id,
                    { key: pdfKey },
                    transaction
                )
            }

            if (previewFile) {
                const previewKey = generateUuid()
                const previewBuffer = await readFile(previewFile.path)
                await this.s3.upload(previewKey, previewBuffer, { prefix: 'article_previews/' })
                article.preview_key && await this.s3.delete(article.preview_key, 'article_previews/')
                await this.sequelize.update(
                    updatedArticle.id,
                    { preview_key: previewKey },
                    transaction
                )
            }  
            if (options.functions?.removePreview) {
                if (article.preview_key) {
                    await this.s3.delete(article.preview_key, 'article_previews/')
                    await this.sequelize.update(
                        updatedArticle.id,
                        { preview_key: null },
                        transaction
                    )
                }
            }

            await this.sequelize.commitTransaction(transaction)
            fileConfig && await removeDir(fileConfig.tempDirPath)

            const finalArticle = await this.sequelize.findById(id)

            return await this.mapper.toFull(finalArticle!)
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
            if (needToRollbackElastic) await this.rollbackElasticChanges(article)
            if (oldFileBuffer) await this.rollbackS3Changes(article, oldFileBuffer)
            fileConfig && removeDir(fileConfig.tempDirPath)
            RethrowApiError('Service error: Method - updateArticle', e)
        } 
    }

    async delete(id: number): Promise<void> {
        const transaction = await this.sequelize.createTransaction()
        let needToRollbackElastic = false

        const article = await this.sequelize.findById(id)
        if (!article) throw ApiError.NotFound(`Article with id: ${id} is not found`)

        try {

            await this.sequelize.destroy(id, transaction)
            await this.elastic.destroyArticle(id)
            await this.s3.delete(article.key)
            await this.s3.delete(article.preview_key, 'article_previews/')

            await this.sequelize.commitTransaction(transaction)
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
            if (needToRollbackElastic) await this.rollbackElasticChanges(article)
            RethrowApiError('Service error: Method - deleteArticle', e)
        }
    }

    async bulkDelete(ids: number[]): Promise<OperationResult> {
        const transaction = await this.sequelize.createTransaction()
        const errorStack: ErrorStack = {}

        try {
            const articles = await this.sequelize.findAll()

            const foundIds = articles.map(a => a.id)
            const missingIds = ids.filter(id => !foundIds.includes(id))
            for (const id of missingIds) {
                errorStack[id] = { message: `Article with id ${id} not found`, code: 'PERSON_NOT_FOUND' }
            }

            await this.sequelize.destroy(ids, transaction)

            for (const article of articles) {
                try {
                    await this.s3.delete(article.key)
                    await this.s3.delete(article.preview_key, "article_previews/")
                } catch (e) {
                    errorStack[article.id] = { message: 'S3 delete failed', code: 'S3_ERROR' }
                }
            }

            await this.sequelize.commitTransaction(transaction)

            return Object.keys(errorStack).length > 0
                ? { success: false, errors: errorStack }
                : { success: true }
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
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
            await this.s3.upload(oldArticle.key, oldFileBuffer)
        } catch (e) {
            throw ApiError.Internal(`Failed to rollback changes in S3, while updating Pdf Article with id: ${oldArticle.id}`)
        }
    }
}