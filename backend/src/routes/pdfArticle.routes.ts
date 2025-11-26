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
        /**
         * @swagger
         * /api/pdfArticles:
         *   get:
         *     summary: Получить список статей
         *     tags:
         *       - Articles
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
         *         name: title
         *         required: false
         *         schema:
         *           type: string
         *           default: ""
         *         description: Название статьи
         *       - in: query
         *         name: extractedText
         *         required: false
         *         schema:
         *           type: string
         *           default: ""
         *         description: Текст статьи
         *       - in: query
         *         name: author
         *         required: false
         *         schema:
         *           type: string
         *           default: ""
         *         description: Автор статьи
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
         *                       type: array
         *                       items:
         *                         $ref: '#/components/schemas/TypeofPdfAcrticlePreviewSchema'
         */
        this.router.get('/', this.pdfArticleController.getArticles.bind(this.pdfArticleController))

        /**
         * @swagger
         * /api/pdfArticles/slug/{slug}:
         *   get:
         *     summary: Получить данные статьи по Slug
         *     tags:
         *       - Articles
         *     parameters:
         *       - in: path
         *         name: slug
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальный Slug статьи
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
         *                       $ref: '#/components/schemas/TypeofPdfArticleFullSchema'
         */
        this.router.get('/slug/:slug', this.pdfArticleController.getArticleBySlug.bind(this.pdfArticleController))
        
        /**
         * @swagger
         * /api/pdfArticles/{id}:
         *   get:
         *     summary: Получить данные статьи по Id
         *     tags:
         *       - Articles
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальный Id статьи
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
         *                       $ref: '#/components/schemas/TypeofPdfArticleFullSchema'
         */
        this.router.get('/:id', this.pdfArticleController.getArticleById.bind(this.pdfArticleController))

        /**
         * @swagger
         * /api/pdfArticles/bulk:
         *   post:
         *     summary: Создать несколько статей с PDF и превью
         *     tags:
         *       - Articles
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               pdf:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Массив PDF-файлов статей, имя файла = название статьи
         *               preview:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Массив изображений превью статей, имя файла = название статьи
         *               data:
         *                 type: string
         *                 description: JSON-массив объектов статей по TypeofPdfAcrticlePreviewSchema
         *                 example: '[{"title":"гагарины","authors":["Ваня Кузьмин"]}]'
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
         *                       $ref: '#/components/schemas/TypeofPdfArticleFullSchema'
         */
        this.router.post('/', prepareTempDir, upload.fields([
            { name: 'pdf', maxCount: 1 },
            { name: 'preview', maxCount: 1 }
        ]), this.pdfArticleController.createArticle.bind(this.pdfArticleController))

        /**
         * @swagger
         * /api/pdfArticles/{id}:
         *   post:
         *     summary: Обновить статью, PDF и превью опциональны
         *     tags:
         *       - Articles
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Уникальный ID статьи
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             properties:
         *               pdf:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: PDF-файл статьи (опционально)
         *               preview:
         *                 type: array
         *                 items:
         *                   type: string
         *                   format: binary
         *                 description: Превью статьи (опционально)
         *               data:
         *                 type: string
         *                 description: JSON-объект статьи с полями по TypeofPdfArticleUpdateSchema
         *                 example: '{"title":"Новая статья","authors":["Ваня Кузьмин"],"functions":{"removePreview":true}}'
         *     responses:
         *       200:
         *         description: Успешное обновление
         *         content:
         *           application/json:
         *             schema:
         *               allOf:
         *                 - $ref: '#/components/schemas/BaseResponse'
         *                 - type: object
         *                   properties:
         *                     data:
         *                       $ref: '#/components/schemas/TypeofPdfArticleFullSchema'
         */
        this.router.post('/:id', prepareTempDir, upload.fields([
            { name: 'pdf', maxCount: 1 },
            { name: 'preview', maxCount: 1 }
        ]), this.pdfArticleController.updateArticle.bind(this.pdfArticleController))

        /**
         * @swagger
         * /api/pdfArticles/bulk:
         *   delete:
         *     summary: Удалить несколько записей о статьях через Id
         *     tags:
         *       - Articles
         *     parameters:
         *       - in: query
         *         name: ids
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальные Id статей через запятую
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
        this.router.delete('/bulk', this.pdfArticleController.bulkDeleteArticles.bind(this.pdfArticleController))

        /**
         * @swagger
         * /api/pdfArticles/{id}:
         *   delete:
         *     summary: Удалить запись о статье через Id
         *     tags:
         *       - Articles
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Уникальный Id статьи
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
        this.router.delete('/:id', this.pdfArticleController.deleteArticle.bind(this.pdfArticleController))
    }

    getRouter(): Router { return this.router }
}