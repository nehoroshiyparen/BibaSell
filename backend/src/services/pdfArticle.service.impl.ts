import { DatabaseImpl } from "#src/database/database.impl.js";
import { TYPES } from "#src/di/types.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { Status } from "#src/types/interfaces/http/Status.interface.js";
import { TypeofPdfArticleFiltersSchema } from "#src/types/schemas/pdfArticle/PdfArticleFilters.schema.js";
import { TypeofPdfArticlePatchSchema } from "#src/types/schemas/pdfArticle/PdfArticlePatch.schema.js";
import { TypeofPdfArticleUpdateSchema } from "#src/types/schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { RethrowApiError } from "#src/utils/ApiError/RethrowApiError.js";
import { inject, injectable } from "inversify";
import { Sequelize } from "sequelize";

@injectable()
export class PdfArticleServiceImpl implements IPdfArticleService {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: DatabaseImpl,
    ) {
        this.sequelize = this.database.getDatabase()
    }

    getArticleById(id: number): Promise<TypeofPdfArticleFullSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - getArticleById', e)
        }
    }

    getArticles(offset: number, limit: number): Promise<TypeofPdfAcrticlePreviewSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - getArticles', e)
        }
    }

    getFilteredArticles(
        filters: TypeofPdfArticleFiltersSchema
    ): Promise<TypeofPdfAcrticlePreviewSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - getFilteredArticles', e)
        }
    }

    createArticle(
        options: TypeofPdfArticlePatchSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - createArticle', e)
        }
    }

    updateArticle(
        otpions: TypeofPdfArticleUpdateSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - updateArticle', e)
        }
    }

    deleteArticle(id: number): Promise<Status> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - deleteArticle', e)
        }
    }

    bulkDeleteArticles(ids: number[]): Promise<Status> {
        try {

        } catch (e) {
            RethrowApiError('Service error: Method - bulkDeleteArticles', e)
        }
    }
}