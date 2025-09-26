import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { status } from "#src/consts/index.js";
import { TYPES } from "#src/di/types.js";
import { IMDXArticleService } from "#src/types/contracts/services/mdxArticles/mdxArticle.service.interface.js";
import { MDXArticleFiltersSchema } from "#src/types/schemas/mdxArticle/MDXArticleFilters.schema.js";
import { MDXArticleCreateSchema } from "#src/types/schemas/mdxArticle/MDXArticlePatch.schema.js";
import { SendError, SendResponse } from "#src/utils/http/index.js";
import { ValidateObjectFieldsNotNull } from "#src/utils/validations/objectFieldsNotNull.validate.js";
import { ValidateId } from "#src/utils/validations/ids/id.validate.js";
import { ValidateIdArray } from "#src/utils/validations/ids/idArray.validate.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";
import { MDXArticleUpdateSchema } from "#src/types/schemas/mdxArticle/MDXArticleUpdate.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";

@injectable()
export class MDXArticleControllerImpl {
    constructor(
        @inject(TYPES.MDXArticleService) private mdxArticleService: IMDXArticleService
    )  {}

    async getMDXArticleById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const mdxArticle = await this.mdxArticleService.getMDXArticleById(id)

            SendResponse(res, status.OK, `MDXArticle fetched`, mdxArticle)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Будет POST запросом, тк в query сомнительно передавать данные для фильтрации, 
     * ведь они могут быть достаточно большими
     * @param req 
     * @param res 
     */
    async getFilteredMDXArticles(req: Request, res: Response) {
        try {
            const filters = req.body

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = MDXArticleFiltersSchema.parse(filters)

            const mdxArticles = await this.mdxArticleService.getFilteredMDXArticles(validatedFilters)

            SendResponse(res, mdxArticles ? status.OK : status.NOT_FOUND , mdxArticles.length !== 0 ? `MDXArticle fetched` : `No candidates found`, mdxArticles)
        } catch (e) {
            SendError(res, e)
        }
    }

    async searchMDXArticleByContent(req: Request, res: Response) {
        try {
            const content = String(req.params.content)

            if (!content) throw ApiError.BadRequest(`Content is null`)
                
            const mdxArticle = await this.mdxArticleService.searchMDXArticleByContent(content)
    
            SendResponse(res, status.OK, `MDXArticle fetched`, mdxArticle)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getMDXArticleContent(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const mdxArticle = await this.mdxArticleService.getMDXArticleContent(id)

            SendResponse(res, status.OK, `MDXArticle fetched`, mdxArticle)
        } catch (e) {
            SendError(res, e)
        }
    }

    async craeteMDXArticle(req: Request, res: Response) {
        try {
            const options = JSON.parse(req.body.data)

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = MDXArticleCreateSchema.parse(options)

            const fileConfig: FileConfig | undefined = 
                req.tempUploadDir ? 
                    {
                        tempDirPath: req.tempUploadDir,
                        files: req.files as Express.Multer.File[] | undefined,
                    } : undefined
            
            const mdxArticle = await this.mdxArticleService.createMDXArticle(validatedOptions, fileConfig)

            SendResponse(res, status.CREATED, `MDXArticle created`, mdxArticle)
        } catch (e) {
            SendError(res, e)
        }
    }

    async updateMDXArticle(req: Request, res: Response) {
        try {
            const { id, options }= JSON.parse(req.body.data)

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = MDXArticleUpdateSchema.parse(options)

            const fileConfig: FileConfig | undefined = 
                req.tempUploadDir ? 
                {
                    tempDirPath: req.tempUploadDir,
                    files: req.files as Express.Multer.File[] | undefined
                } : undefined

            const mdxArticle = await this.mdxArticleService.updateArcticle(id, validatedOptions, fileConfig)

            SendResponse(res, status.OK, `MDXArticle updated`, mdxArticle)
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkDeleteMDXArticles(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.mdxArticleService.bulkDeleteMDXArticles(ids)

            SendResponse(res, status, status === 200 ? `MDXArticles deleted` : status === 206 ? `MDXArticles deleted partilly` : `MDXArticles weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}