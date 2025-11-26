import { TYPES } from "#src/di/types.js";
import { upload } from "#src/infrastructure/storage/multer.store.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";
import { PdfArticleControllerImpl } from "#src/modules/pdfArticles/controllers/pdfArticle.controller.js";
import { swaggerSpec } from "#src/modules/swagger/config.js";
import { Router } from "express";
import { inject, injectable } from "inversify";
import swaggerUi from 'swagger-ui-express'

@injectable()
export class SwaggerRouter {
    private router: Router
    constructor(
        @inject(TYPES.PdfArticleController) private pdfArticleController: PdfArticleControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        this.router.use(...(swaggerUi.serve as any));
        this.router.get("/", swaggerUi.setup(swaggerSpec) as any);
    }

    getRouter(): Router { return this.router }
}