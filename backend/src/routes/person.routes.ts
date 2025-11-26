import { Router } from "express";
import { inject, injectable } from "inversify";
import { PersonControllerImpl } from "#src/modules/persons/controllers/person.controller.js";
import { TYPES } from "#src/di/types.js";
import { upload } from "#src/infrastructure/storage/multer.store.js";
import { prepareTempDir } from "#src/middlewares/prepareTempDir.middleware.js";

@injectable()
export class PersonRouter {
    private router: Router

    constructor(
        @inject(TYPES.PersonController) private personController: PersonControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    setup() {
        /**
         * @swagger
         * /api/persons:
         *   get:
         *     summary: Получить список солдат
         *     tags:
         *       - Persons
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
         *         name: name
         *         required: false
         *         schema:
         *           type: string
         *           default: ""
         *         description: Имя солдата
         *       - in: query
         *         name: rank
         *         required: false
         *         schema:
         *           type: string
         *           default: ""
         *         description: Звание солдата
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
         *                         $ref: '#/components/schemas/TypeofPersonPreviewSchema'
         */
        this.router.get('/', this.personController.getPersons.bind(this.personController))

        /**
         * @swagger
         * /api/persons/slug/{slug}:
         *   get:
         *     summary: Получить данные солдата по Slug
         *     tags:
         *       - Persons
         *     parameters:
         *       - in: path
         *         name: slug
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальный Slug солдата
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
         *                       $ref: '#/components/schemas/TypeofPersonFullSchema'
         */
        this.router.get('/slug/:slug', this.personController.getPersonBySlug.bind(this.personController)) 

        /**
         * @swagger
         * /api/persons/{id}:
         *   get:
         *     summary: Получить данные солдата по Id
         *     tags:
         *       - Persons
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Уникальный Id солдата
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
         *                       $ref: '#/components/schemas/TypeofPersonFullSchema'
         */
        this.router.get('/:id', this.personController.getPersonById.bind(this.personController))

        /**
         * @swagger
         * /api/persons/bulk:
         *   post:
         *     summary: Создать несколько солдат с изображениями
         *     tags:
         *       - Persons
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
         *                 description: Массив файлов изображений, имя файла = имя солдата
         *               data:
         *                 type: string
         *                 description: JSON-массив объектов солдат по PersonSchema
         *                 example: '[{"name":"АЛЕКСЕЕВА Зинаида Васильевна","addition":"...","description":"...","rank":"...","comments":"...","rewards":[{"label":"Медаль «ЗА БОЕВЫЕ ЗАСЛУГИ»"}]}]'
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
        ]), this.personController.bulkCreatePersons.bind(this.personController))

        /**
         * @swagger
         * /api/persons/bulk:
         *   delete:
         *     summary: Удалить несколько записей о солдатах через Id
         *     tags:
         *       - Persons
         *     parameters:
         *       - in: query
         *         name: ids
         *         required: true
         *         schema:
         *           type: string
         *         description: Уникальные Id солдат через запятую
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
        this.router.delete('/bulk', this.personController.bulkDeletePersons.bind(this.personController))

        /**
         * @swagger
         * /api/persons/{id}:
         *   delete:
         *     summary: Удалить запись о солдате через Id
         *     tags:
         *       - Persons
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: Уникальный Id солдата
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
        this.router.delete('/:id', this.personController.deletePerson.bind(this.personController))
    }

    getRouter(): Router { return this.router }
}