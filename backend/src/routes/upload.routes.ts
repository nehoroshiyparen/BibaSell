import { TYPES } from "#src/di/types.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";
import { UploadControllerImpl } from "#src/modules/upload/controllers/upload.controller.js";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class UploadRouter {
    private router: Router
    constructor(
        @inject(TYPES.UploadControllerImpl) private uploadController: UploadControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        this.router.patch('/reward',
                        prepareTempDir,
                        this.uploadController.uploadRewardPack.bind(this.uploadController)
                    )
        this.router.patch('/person',
                        prepareTempDir,
                        this.uploadController.uploadPersonPack.bind(this.uploadController)
        )
    }

    getRouter(): Router {  return this.router }
}