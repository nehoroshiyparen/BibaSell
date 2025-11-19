import { status } from "#src/consts/status.js";
import { TYPES } from "#src/di/types.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js"; 
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { PdfArticleFiltersSchema, TypeofPdfArticleFiltersSchema } from "../schemas/pdfArticle/PdfArticleFilters.schema.js";
import { PdfArticlePatchSchema, TypeofPdfArticlePatchSchema } from "../schemas/pdfArticle/PdfArticlePatch.schema.js";
import { PdfArticleUpdateSchema } from "../schemas/pdfArticle/PdfArticleUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { SendError } from "#src/lib/http/SendError.js";
import { SendResponse } from "#src/lib/http/SendResponse.js";
import { ValidateId } from "#src/shared/validations/ids/id.validate.js";
import { ValidateIdArray } from "#src/shared/validations/ids/idArray.validate.js";
import { ValidateObjectFieldsNotNull } from "#src/shared/validations/objectFieldsNotNull.validate.js";
import { ValidatePaginationParams } from "#src/shared/validations/paginationParams.validate.js";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class PdfArticleControllerImpl {
    constructor(
        @inject(TYPES.PdfArticleService) private pdfArticleService: IPdfArticleService
    ) {}

    async getArticleById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            ValidateId(id)

            const article = await this.pdfArticleService.getById(id)

            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.OK,
                        message: 'Article fetched'
                    }
                ],
                data: article
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async getArticleBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)

            const article = await this.pdfArticleService.getBySlug(slug)

            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.OK,
                        message: 'Article fetched'
                    }
                ],
                data: article
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async getArticles(req: Request, res: Response) {
    try {
        const offset = Number(req.query.offset) || 0
        const limit = Number(req.query.limit) || 10

        ValidatePaginationParams(offset, limit)

        const filters: Partial<TypeofPdfArticleFiltersSchema> = {
            title: req.query.title?.toString(),
            extractedText: req.query.extractedText?.toString(),
            author: req.query.author?.toString(),
        }

        const articles = await this.pdfArticleService.getList(offset, limit, filters)

        SendResponse(res, {
            cases: [
                {
                    condition: () => true,
                    status: status.OK,
                    message: articles.length > 0 ? 'Articles fetched' : 'No articles found',
                }
            ],
            data: articles
        })
    } catch (e) {
        SendError(res, e)
    }
}
    
    async createArticle(req: Request, res: Response) {
        try {
            if (!req.body.data) {
                throw ApiError.BadRequest('Missing data field in body')
            }
            if (!req.tempUploadDir) {
                throw ApiError.Internal('Server has not prepared necessary dirs')
            }
            
            const options = JSON.parse(req.body.data)

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = PdfArticlePatchSchema.parse(options)

            const files = req.files as Record<string, Express.Multer.File[]>

            const pdfFile: Express.Multer.File = files.pdf?.[0] 
            const previewFile: Express.Multer.File = files.preview?.[0] 
            
            const hasFiles = !!pdfFile;
                if (!hasFiles) {
                    throw new ApiError(status.BAD_REQUEST, 'Article cant be created without file. File is not attached')
                }
            
            const fileConfig: FileConfig | undefined = {
                tempDirPath: req.tempUploadDir,
                files: {
                    preview: previewFile,
                    pdf: pdfFile
                }
            }

            const article = await this.pdfArticleService.create(validatedOptions, fileConfig)

            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.CREATED,
                        message: 'Article created'
                    }
                ],
                data: article
            })
        } catch (e) {
            SendError(res, e)
        }
    }
    
    async updateArticle(req: Request, res: Response) {
        try {
            if (!req.tempUploadDir) {
                throw ApiError.Internal('Server has not prepared necessary dirs')
            }

            const options = JSON.parse(req.body.data)
            const id = Number(req.params.id)

            const validatedOptions = PdfArticleUpdateSchema.parse(options)

            const files = req.files as Record<string, Express.Multer.File[]>

            const pdfFile: Express.Multer.File = files.pdf?.[0]
            const previewFile: Express.Multer.File = files.preview?.[0]
            
            const hasFiles = !!pdfFile || !!previewFile;
            
            const fileConfig: FileConfig | undefined = {
                tempDirPath: req.tempUploadDir,
                files: {
                    preview: previewFile,
                    pdf: pdfFile
                }
            }

            const hasOptions = validatedOptions && Object.keys(validatedOptions).length > 0;

            if (!hasOptions && !hasFiles) {
                throw new ApiError(status.BAD_REQUEST, 'At least one option param has to be specified or file needs to be attached');
            }
            const article = await this.pdfArticleService.update(id, validatedOptions, fileConfig)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.CREATED,
                        message: 'Article updated'
                    }
                ],
                data: article
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async deleteArticle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            ValidateId(id)

            await this.pdfArticleService.delete(id)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: 'Article deleted'
                    }
                ],  
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkDeleteArticles(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)
            ValidateIdArray(ids)

            const bulkDeleteResult = await this.pdfArticleService.bulkDelete(ids)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => !bulkDeleteResult.errors,
                        status: 200,
                        message: 'Articles deleted'
                    },
                    {
                        condition: () => !!bulkDeleteResult.errors && bulkDeleteResult.errors.length < ids.length,
                        status: 206,
                        message: 'Articles deleted partilly'
                    },
                    {
                        condition: () => true,
                        status: 400,
                        message: 'Articles were not deleted. To much invalid data'
                    }
                ],
                data: bulkDeleteResult
            })
        } catch (e) {
            SendError(res, e)
        }
    }
}