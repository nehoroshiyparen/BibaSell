import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js"
import { Status } from "#src/types/interfaces/http/Status.interface.js"
import { TypeofPdfArticleFiltersSchema } from "#src/types/schemas/pdfArticle/PdfArticleFilters.schema.js"
import { TypeofPdfArticleFullSchema } from "#src/types/schemas/pdfArticle/PdfArticleFull.schema.js"
import { TypeofPdfArticlePatchSchema } from "#src/types/schemas/pdfArticle/PdfArticlePatch.schema.js"
import { TypeofPdfAcrticlePreviewSchema } from "#src/types/schemas/pdfArticle/PdfArticlePreview.schema.js"
import { TypeofPdfArticleUpdateSchema } from "#src/types/schemas/pdfArticle/PdfArticleUpdate.schema.js"

export interface IPdfArticleService {
    getArticleById(id: number): Promise<TypeofPdfArticleFullSchema>
    getArticles(offset: number, limit: number): Promise<TypeofPdfAcrticlePreviewSchema>
    getFilteredArticles(
        filters: TypeofPdfArticleFiltersSchema
    ): Promise<TypeofPdfAcrticlePreviewSchema>
    createArticle(
        options: TypeofPdfArticlePatchSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema>
    updateArticle(
        otpions: TypeofPdfArticleUpdateSchema, 
        fileConfig: FileConfig | undefined
    ): Promise<TypeofPdfArticleFullSchema>
    deleteArticle(id: number): Promise<Status>
    bulkDeleteArticles(ids: number[]): Promise<Status>
}