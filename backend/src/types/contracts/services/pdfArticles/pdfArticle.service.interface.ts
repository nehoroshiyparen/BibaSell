import { TypeofPdfArticleFiltersSchema } from "#src/modules/pdfArticles/schemas/pdfArticle/PdfArticleFilters.schema.js";
import { TypeofPdfArticleFullSchema } from "#src/modules/pdfArticles/schemas/pdfArticle/PdfArticleFull.schema.js";
import { TypeofPdfArticlePatchSchema } from "#src/modules/pdfArticles/schemas/pdfArticle/PdfArticlePatch.schema.js";
import { TypeofPdfAcrticlePreviewSchema } from "#src/modules/pdfArticles/schemas/pdfArticle/PdfArticlePreview.schema.js";
import { TypeofPdfArticleUpdateSchema } from "#src/modules/pdfArticles/schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { IBaseService } from "../module.service.interface.js";

export interface IPdfArticleService
    extends IBaseService<
        TypeofPdfArticleFullSchema,
        TypeofPdfAcrticlePreviewSchema,
        TypeofPdfArticleFiltersSchema,
        TypeofPdfArticlePatchSchema,
        TypeofPdfArticleUpdateSchema
    > {
        create(options: TypeofPdfArticlePatchSchema, fileConfig: FileConfig): Promise<TypeofPdfArticleFullSchema>
        update(id: number, options: TypeofPdfArticleUpdateSchema, fileConfig: FileConfig | undefined): Promise<TypeofPdfArticleFullSchema>
    }