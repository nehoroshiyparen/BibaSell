import { status } from "#src/consts/status.js";
import { TYPES } from "#src/di/types.js";
import { IPdfArticleService } from "#src/types/contracts/services/pdfArticles/pdfArticle.service.interface.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { TypeofPdfArticleFiltersSchema } from "../schemas/pdfArticle/PdfArticleFilters.schema.js";
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

            const article = await this.pdfArticleService.getArticleById(id)

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
            const [offset, limit] = ['offset', 'limit'].map(k => Number(req.query[k]))

            ValidatePaginationParams(offset, limit)

            const articles = await this.pdfArticleService.getArticles(offset, limit)

            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.OK,
                        message: articles.length > 0 ? 'Articles fetched' : 'No more articles found'
                    }
                ], 
                data: articles
            })
        } catch (e) {
            SendError(res, e)
        }
    }
    
    async getFilteredArticles(req: Request, res: Response) {
        try {
            const fileters: TypeofPdfArticleFiltersSchema = {
                title: req.query.title?.toString() || '',
                extractedText: req.query.text?.toString() || '',
                author: req.query.authors?.toString() || '',
            }

            ValidateObjectFieldsNotNull(fileters)

            const candidates = await this.pdfArticleService.getFilteredArticles(fileters)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: candidates.length > 0 ? 'Article fetched' : 'Articles not found'
                    }
                ],
                data: candidates
            })
        } catch (e) {
            SendError(res, e)
        }
    }
    
    async createArticle(req: Request, res: Response) {
        try {
            const options = JSON.parse(req.body.data)

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = PdfArticlePatchSchema.parse(options)

            const fileConfig: FileConfig | undefined = 
                req.tempUploadDir ?
                    {
                        tempDirPath: req.tempUploadDir,
                        files: (req.files as Express.Multer.File[] | undefined) || []
                    } : undefined
            
            const hasFiles = fileConfig?.files && fileConfig.files.length > 0;
                if (!hasFiles) {
                    throw new ApiError(status.BAD_REQUEST, 'Article cant be created without file. File is not attached')
                }

            const article = await this.pdfArticleService.createArticle(validatedOptions, fileConfig)

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
            const options = JSON.parse(req.body.data)

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = PdfArticleUpdateSchema.parse(options)

            const fileConfig: FileConfig | undefined = 
                req.tempUploadDir ?
                    {
                        tempDirPath: req.tempUploadDir,
                        files: (req.files as Express.Multer.File[] | undefined) || []
                    } : undefined

            const hasOptions = validatedOptions && Object.keys(validatedOptions).length > 0;
            const hasFiles = fileConfig?.files && fileConfig.files.length > 0;

            if (!hasOptions && !hasFiles) {
                throw new ApiError(status.BAD_REQUEST, 'At least one option param has to be specified or file needs to be attached');
            }
            
            const article = await this.pdfArticleService.updateArticle(validatedOptions, fileConfig)

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

    async deleteArticle(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            ValidateId(id)

            await this.pdfArticleService.deleteArticle(id)

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
            const ids = req.params.ids.split(',').map(Number)
            ValidateIdArray(ids)

            const bulkDeleteResult = await this.pdfArticleService.bulkDeleteArticles(ids)

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