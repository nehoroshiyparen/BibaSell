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
        /**
         * @swagger
         * /api/upload/reward:
         *   patch:
         *     summary: Занести заготовленный список данных о наградах на сервер. Данные хранятся в папке src/data/rewards на сервере
         *     tags:
         *       - Upload
         *     responses:
         *       200:
         *         description: Успешный ответ
         *         content:
         *           application/json:
         *             schema:
         *               allOf:
         *                 - $ref: '#/components/schemas/BaseResponse'
         *                 - type: object
         *                   properties:
         *                     data:
         *                       type: object
         *                       properties:
         *                         success:
         *                           type: boolean
         *                         created:
         *                           type: integer
         *                       example:
         *                         success: true
         *                         created: 1
         */
        this.router.patch('/reward',
                        prepareTempDir,
                        this.uploadController.uploadRewardPack.bind(this.uploadController)
                    )

        /**
         * @swagger
         * /api/upload/person:
         *   patch:
         *     summary: Занести заготовленный список данных о солдатах на сервер. Данные хранятся в папке src/data/person на сервере
         *     tags:
         *       - Upload
         *     responses:
         *       200:
         *         description: Успешный ответ
         *         content:
         *           application/json:
         *             schema:
         *               allOf:
         *                 - $ref: '#/components/schemas/BaseResponse'
         *                 - type: object
         *                   properties:
         *                     data:
         *                       type: object
         *                       properties:
         *                         success:
         *                           type: boolean
         *                         created:
         *                           type: integer
         *                       example:
         *                         success: true
         *                         created: 1
         */
        this.router.patch('/person',
                        prepareTempDir,
                        this.uploadController.uploadPersonPack.bind(this.uploadController)
        )
    }

    getRouter(): Router {  return this.router }
}