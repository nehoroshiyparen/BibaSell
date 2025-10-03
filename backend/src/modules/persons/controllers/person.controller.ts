import { Request, Response } from "express";
import { PersonArraySchema } from "../schemas/PersonArraySchema.js";
import { SendError, SendResponse } from "#src/shared/http/index.js";
import { status } from "#src/consts/status.js";
import { IPersonService } from "#src/types/contracts/services/persons/person.service.interface.js";
import { injectable, inject } from "inversify";
import { TYPES } from "#src/di/types.js";
import { ValidateId } from "#src/shared/validations/ids/id.validate.js";
import { ValidatePaginationParams } from "#src/shared/validations/paginationParams.validate.js";
import { ValidateObjectFieldsNotNull } from "#src/shared/validations/objectFieldsNotNull.validate.js";
import { ValidateIdArray } from "#src/shared/validations/ids/idArray.validate.js";
import { PersonFiltersSchema } from "#src/modules/persons/schemas/PersonFilters.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";

@injectable()
export class PersonControllerImpl {
    constructor (
        @inject(TYPES.PersonService) private personService: IPersonService
    ) {}

    /**
     * Возвращает сущность Person по айди
     * @param req В params ожидается id 
     * @param res 
     * @thorws {BadRequest} Если айди невалиден
     * @throws {NotFound} Если в базе данных не найдено сущности с таким id
     * @throws {Internal} Если возникает непредсказанная ошибка
     */
    async getPersonById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const person = await this.personService.getPersonById(id)

            SendResponse(res, status.OK, `Person fetched`, person)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getPersonBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)

            const person = await this.personService.getPersonBySlug(slug)

            SendResponse(res, status.OK, `Person fetched`, person)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Пагинационный запрос. Возвращает массив объектов Person
     * @param req В query запроса ожидается offset и limit
     * @param res 
     * @thorws {BadRequest} Если offset или limit невалидны
     * @throws {Internal} Если возникает непредсказанная ошибка
     */
    async getPersons(req: Request, res: Response) {
        try {
            const offset = Number(req.query.offset) || 0
            const limit = Math.min(Number(req.query.limit) || 20, 100)

            ValidatePaginationParams(offset, limit)

            const persons = await this.personService.getPersons(offset, limit)

            SendResponse(res, status.OK, persons?.length !== 0 ? `Persons fetched` : `No more data`, persons)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Возвращает массив объектов Person по указанным фильтрам
     * @param req В body запроса указываются параметры для фильтрации. Параметры могут быть любым свойством Person
     * @param res 
     * @throws {BadRequest} Если ни один параметр фильтрации не указан
     * @throws {Internal} Если возникает непредсказанная ошибка
     */
    async getFilteredPersons(req: Request, res: Response) {
        try {
            const filters = req.body

            const offset = Number(req.query.offset) || 0
            const limit = Math.min(Number(req.query.limit) || 20, 100)

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = PersonFiltersSchema.parse(filters)

            const persons = await this.personService.getFilteredPersons(validatedFilters, offset, limit)

            SendResponse(res, status.OK, persons?.length !== 0 ? `Persons fetched` : `No candidates found`, persons)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Хендлер позволяет добавить сущности в базу данных
     * @param req В теле запроса указывается массив объектов типа Person
     * @param res 
     * @throws {BadRequest} Если хотя бы половина данных не смогла сохраниться в базе данных (Никакие изменения в таком случае не внесутся в бд)
     * @throws {Internal} Если возникает непредсказанная ошибка
     */
    async bulkCreatePersons(req: Request, res: Response) {
        try {
            const dataPack = JSON.parse(req.body.data)

            const validatedData = PersonArraySchema.parse(dataPack)

            const fileConfig: FileConfig | undefined = 
            req.tempUploadDir ? 
                {
                    tempDirPath: req.tempUploadDir,
                    files: (req.files as Express.Multer.File[] | undefined) || []
                } : undefined

            const { status } =  await this.personService.bulkCreatePersons(validatedData, fileConfig)

            SendResponse(res, status, status === 201 ? `Persons created` : status === 206 ? `Persons created partilly` : `Persons weren't created. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Хендлер позволяет удалить сущности из бд через id
     * @param req В query указывается список id. Id разделяются через запятую ","
     * @param res 
     * @throws {BadRequest} Если id не указаны или один из них невалиден
     * @throws {BadRequest} Если хотя бы половина данных не смогла сохраниться в базе данных (Никакие изменения в таком случае не внесутся в бд)
     * @throws {Internal} Если возникает непредсказанная ошибка
     */
    async bulkDeletePersons(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.personService.bulkDeletePersons(ids)

            SendResponse(res, status, status === 200 ? `Persons deleted` : status === 206 ? `Persons deleted partilly` : `Persons weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}