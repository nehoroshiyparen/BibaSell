import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { status } from "src/consts";
import { TYPES } from "src/di/types";
import { ArticleServiceAbstract } from "src/types/abstractions/services/article.service.abstraction";
import { ArticleFiltersSchema } from "src/types/schemas/article/ArticleFilters.schema";
import { ArticlePatchSchema } from "src/types/schemas/article/ArticlePatch.schema";
import { SendError, SendResponse } from "src/utils/http";
import { ValidateObjectFieldsNotNull } from "src/utils/validations/objectFieldsNotNull.validate";
import { ValidateId } from "src/utils/validations/ids/id.validate";
import { ValidateIdArray } from "src/utils/validations/ids/idArray.validate";

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
    async getFilteredArticle(req: Request, res: Response) {
        try {
            const filters = req.body

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = ArticleFiltersSchema.parse(filters)

            const article = await this.articleService.getFilteredArticle(validatedFilters)

            SendResponse(res, article ? status.OK : status.NOT_FOUND , article ? `Article fetched` : `No candidates found`, article)
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

    async deleteArticles(req: Request, res: Response) {
        try {
            const ids = String(req.query).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.articleService.deleteArticles(ids)

            SendResponse(res, status, status === 200 ? `Articles deleted` : status === 206 ? `Articles deleted partilly` : `Articles weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}