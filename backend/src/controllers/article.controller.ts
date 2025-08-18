import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { status } from "#src/consts/index.js";
import { TYPES } from "#src/di/types.js";
import { ArticleServiceAbstract } from "#src/types/abstractions/services/article.service.abstraction.js";
import { ArticleFiltersSchema } from "#src/types/schemas/article/ArticleFilters.schema.js";
import { ArticlePatchSchema } from "#src/types/schemas/article/ArticlePatch.schema.js";
import { SendError, SendResponse } from "#src/utils/http/index.js";
import { ValidateObjectFieldsNotNull } from "#src/utils/validations/objectFieldsNotNull.validate.js";
import { ValidateId } from "#src/utils/validations/ids/id.validate.js";
import { ValidateIdArray } from "#src/utils/validations/ids/idArray.validate.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";

@injectable()
export class ArticleControllerImpl {
    constructor(
        @inject(TYPES.ArticleService) private articleService: ArticleServiceAbstract
    )  {}

    async getArticleById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const article = await this.articleService.getArticleById(id)

            SendResponse(res, status.OK, `Article fetched`, article)
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
    async getFilteredArticles(req: Request, res: Response) {
        try {
            const filters = req.body

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = ArticleFiltersSchema.parse(filters)

            const articles = await this.articleService.getFilteredArticles(validatedFilters)

            SendResponse(res, articles ? status.OK : status.NOT_FOUND , articles.length !== 0 ? `Article fetched` : `No candidates found`, articles)
        } catch (e) {
            SendError(res, e)
        }
    }

    async searchArticleByContent(req: Request, res: Response) {
        try {
            const content = String(req.params.content)

            if (!content) throw ApiError.BadRequest(`Content is null`)
                
            const article = await this.articleService.searchArticleByContent(content)
    
            SendResponse(res, status.OK, `Article fetched`, article)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getArticleContent(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const article = await this.articleService.getArticleContent(id)

            SendResponse(res, status.OK, `Article fetched`, article)
        } catch (e) {
            SendError(res, e)
        }
    }

    async craeteArticle(req: Request, res: Response) {
        try {
            const options = req.body

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = ArticlePatchSchema.parse(options)
            
            const article = await this.articleService.createArticle(validatedOptions)

            SendResponse(res, status.CREATED, `Article created`, article)
        } catch (e) {
            SendError(res, e)
        }
    }

    async updateArticle(req: Request, res: Response) {
        try {
            const { id, ...options }= req.body

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = ArticlePatchSchema.parse(options)

            const article = await this.articleService.updateArcticle(id, validatedOptions)

            SendResponse(res, status.OK, `Article updated`, article)
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkDeleteArticles(req: Request, res: Response) {
        try {
            const ids = String(req.query).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.articleService.bulkDeleteArticles(ids)

            SendResponse(res, status, status === 200 ? `Articles deleted` : status === 206 ? `Articles deleted partilly` : `Articles weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}