import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { status } from "src/consts";
import { TYPES } from "src/di/types";
import { ArticleServiceAbstract } from "src/types/abstractions/services/article.service.abstraction";
import { ArticlePatchSchema } from "src/types/schemas/article/ArticlePatch.schema";
import { SendError, SendResponse } from "src/utils/http";
import { ValidateFilters } from "src/utils/validations/filtes.validate";
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

    async getFilteredArticle(req: Request, res: Response) {
        try {
            const filters = {
                tilte: String(req.query.title),
                slug: String(req.query.slug),
                author_username: String(req.query.author_username),
                content: String(req.query.content)
            }

            ValidateFilters(filters)

            const article = await this.articleService.getFilteredArticle(filters)

            SendResponse(res, article ? status.OK : status.NOT_FOUND , article ? `Article fetched` : `No candidates found`, article)
        } catch (e) {
            SendError(res, e)
        }
    }

    async craeteArticle(req: Request, res: Response) {
        try {
            const options = req.body
            const validatedOptions = ArticlePatchSchema.parse(options)
            
            const article = await this.articleService.createArticle(validatedOptions)

            SendResponse(res, status.CREATED, `Article created`, null)
        } catch (e) {
            SendError(res, e)
        }
    }

    async updateArticle(req: Request, res: Response) {
        try {
            const { id, ...options }= req.body
            const validatedOptions = ArticlePatchSchema.parse(options)

            const article = await this.articleService.updateArcticle(id, validatedOptions)

            SendResponse(res, status.OK, `Article updated`, article)
        } catch (e) {
            SendError(res, e)
        }
    }

    async deleteArticle(req: Request, res: Response) {
        try {
            const ids = String(req.query).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.articleService.deleteArticle(ids)

            SendResponse(res, status, status === 200 ? `Articles deleted` : `Articles deleted partilly`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}