import { TYPES } from "#src/di/types.js";
import { upload } from "#src/infrastructure/storage/multer.store.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";
import { PdfArticleControllerImpl } from "#src/modules/pdfArticles/controllers/pdfArticle.controller.js";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class PdfArticleRouter {
    private router: Router
    constructor(
        @inject(TYPES.PdfArticleController) private pdfArticleController: PdfArticleControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        this.router.get('/', this.pdfArticleController.getArticles.bind(this.pdfArticleController))
        this.router.get('/filtered', this.pdfArticleController.getFilteredArticles.bind(this.pdfArticleController))
        this.router.get('/:id', this.pdfArticleController.getArticleById.bind(this.pdfArticleController))

        this.router.post('/create', prepareTempDir, upload.array('files'), this.pdfArticleController.createArticle.bind(this.pdfArticleController))

        this.router.put('/update/:id', prepareTempDir, upload.array('files'), this.pdfArticleController.updateArticle.bind(this.pdfArticleController))

        this.router.delete('/', this.pdfArticleController.bulkDeleteArticles.bind(this.pdfArticleController))
        this.router.delete('/:id', this.pdfArticleController.deleteArticle.bind(this.pdfArticleController))
    }

    getRouter(): Router { return this.router }
}