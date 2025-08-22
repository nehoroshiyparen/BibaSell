import { Router } from "express";
import { inject, injectable } from "inversify";
import { ArticleControllerImpl } from "#src/controllers/article.controller.js";
import { TYPES } from "#src/di/types.js";
import { RouterAbstract } from "#src/types/abstractions/index.js";

@injectable()
export class ArticleRouter implements RouterAbstract {
    private router: Router

    constructor (
        @inject(TYPES.ArticleController) private articleController: ArticleControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }
    
    async setup(): Promise<void> {
        this.router.post('/filtered', this.articleController.getFilteredArticles.bind(this.articleController))
        this.router.get('/:id', this.articleController.getArticleById.bind(this.articleController))
        this.router.get('/content/:id', this.articleController.getArticleContent.bind(this.articleController))
        this.router.get('/search/:content', this.articleController.searchArticleByContent.bind(this.articleController))

        this.router.post('/', this.articleController.craeteArticle.bind(this.articleController))

        this.router.put('/update', this.articleController.updateArticle.bind(this.articleController))

        this.router.delete('/bulk', this.articleController.bulkDeleteArticles.bind(this.articleController))
    }

    getRouter(): Router {
        return this.router
    }
}