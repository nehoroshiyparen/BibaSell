import { Router } from "express";
import { inject, injectable } from "inversify";
import { RewardControllerImpl } from "#src/modules/rewards/controllers/reward.controller.js";
import { TYPES } from "#src/di/types.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";
import { upload } from "#src/infrastructure/storage/multer.store.js";

@injectable()
export class RewardRouter {
    private router: Router

    constructor(
        @inject(TYPES.RewardController) private rewardController: RewardControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        /**
         * @swagger
         * /api/rewards:
         *   get:
         *     summary: Получить список наград
         *     tags:
         *       - Rewards
         *     parameters:
         *       - in: query
         *         name: offset
         *         required: false
         *         schema:
         *           type: integer
         *           default: 0
         *         description: Отступ при запросе в БД
         *       - in: query
         *         name: limit
         *         required: false
         *         schema:
         *           type: integer
         *           default: 10
         *         description: Количество возвращаемых записей
         *       - in: query
         *         name: label
         *         required: false
         *         schema:
         *           type: string
         *           default: ""
         *         description: Название награды
         *     responses:
         *       200:
         *         description: Успешный ответ
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: integer
         *                 message:
         *                   type: string
         *                 data:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/TypeofRewardPreviewSchema'
         */
        this.router.get('/', this.rewardController.getRewards.bind(this.rewardController))

        /**
         * @swagger
         * /api/rewards/slug/{slug}:
         *   get:
         *     summary: Получить данные награды по Slug
         *     tags:
         *       - Rewards
         *     parameters:
         *       - in: path
         *         name: slug
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальный Slug награды
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
         *                       $ref: '#/components/schemas/TypeofRewardFullSchema'
         */
        this.router.get('/slug/:slug', this.rewardController.getRewardBySlug.bind(this.rewardController))

        /**
         * @swagger
         * /api/rewards/{id}:
         *   get:
         *     summary: Получить данные награды по Id
         *     tags:
         *       - Rewards
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Уникальный Id награды
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
         *                       $ref: '#/components/schemas/TypeofRewardFullSchema'
         */
        this.router.get('/:id', this.rewardController.getRewardById.bind(this.rewardController))

        /**
         * @swagger
         * /api/rewards/bulk:
         *   post:
         *     summary: Создать несколько наград с изображениями
         *     tags:
         *       - Rewards
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               images:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Массив файлов изображений, имя файла = имя награды
         *               data:
         *                 type: string
         *                 description: JSON-массив объектов наград по TypeofRewardFullSchema
         *                 example: '[{"label":"ОРДЕН ЛЕНИНА","releaseDate":"6 апреля 1930 года","count":431418,"addition":"Из статута 05 мая 1930 года (статут – порядок награждения орденом, его описание): «награждаются отдельные граждане, коллективы, учреждения, предприятия и общественные организации Союза ССР за особые заслуги в социалистическом строительстве:а) за деятельность, результатом которой явились выдающиеся количественные и качественные достижения в промышленности, сельском хозяйстве, на транспорте, в товарообороте и заготовительных операциях государственных и кооперативных учреждений, предприятий и организаций; <…>г) за внесение имеющих государственное значение технических улучшений в промышленное и сельскохозяйственное производство, в дело транспорта и за выдающиеся изобретения в этих областях;д) за выдающееся проведение специальных, особой государственной важности, заданий в области промышленности, сельского хозяйства, торговли, обороны страны, транспорта и кооперации;е) за выдающуюся научно-исследовательскую работу в области социалистического строительства; <…>».","description":"","image_path":"./images/ОРДЕН ЛЕНИНА.jpg"}]'
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
        this.router.post('/bulk', prepareTempDir, upload.fields([
            { name: 'images', maxCount: 50 },
        ]), this.rewardController.bulkCreateRewards.bind(this.rewardController))
        
        /**
         * @swagger
         * /api/rewards/bulk:
         *   delete:
         *     summary: Удалить несколько записей о наградах через Id
         *     tags:
         *       - Rewards
         *     parameters:
         *       - in: query
         *         name: ids
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальные Id наград через запятую
         *         example: "1,2,3,4,5"
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
         *                       example: {}
         */
        this.router.delete('/bulk', this.rewardController.bulkDeleteRewards.bind(this.rewardController))

        /**
         * @swagger
         * /api/rewards/{id}:
         *   delete:
         *     summary: Удалить запись о награде через Id
         *     tags:
         *       - Rewards
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Уникальный Id награды
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
         *                       example: {}
         */
        this.router.delete('/:id', this.rewardController.deleteReward.bind(this.rewardController))
    }

    getRouter(): Router { return this.router }
}