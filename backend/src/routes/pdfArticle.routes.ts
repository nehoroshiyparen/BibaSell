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
        this.router.get('/:id', this.pdfArticleController.getArticleById.bind(this.pdfArticleController))

        this.router.post('/', prepareTempDir, upload.fields([
            { name: 'pdf', maxCount: 1 },
            { name: 'preview', maxCount: 1 }
        ]), this.pdfArticleController.createArticle.bind(this.pdfArticleController))

        this.router.post('/:id', prepareTempDir, upload.fields([
            { name: 'pdf', maxCount: 1 },
            { name: 'preview', maxCount: 1 }
        ]), this.pdfArticleController.updateArticle.bind(this.pdfArticleController))

        this.router.delete('/bulk', this.pdfArticleController.bulkDeleteArticles.bind(this.pdfArticleController))
        this.router.delete('/:id', this.pdfArticleController.deleteArticle.bind(this.pdfArticleController))
    }

    getRouter(): Router { return this.router }
}