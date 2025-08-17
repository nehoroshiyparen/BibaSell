import { Request, Response } from "express";
import { TypeofPersonArraySchema, PersonArraySchema, PersonArrayJsonSchema } from '../types/schemas/person/PersonArraySchema'
import { SendError, SendResponse } from "src/utils/http";
import { status } from "src/consts/status";
import { PersonServiceAbstract } from "src/types/abstractions/services/person.service.abstraction";
import { injectable, inject } from "inversify";
import { TYPES } from "src/di/types";
import { ApiError } from "src/utils/ApiError/ApiError";
import { ValidateId } from "src/utils/validations/ids/id.validate";
import { ValidatePaginationParams } from "src/utils/validations/paginationParams.validate";
import { ValidateObjectFieldsNotNull } from "src/utils/validations/objectFieldsNotNull.validate";
import { ValidateIdArray } from "src/utils/validations/ids/idArray.validate";
import { PersonFiltersSchema } from "src/types/schemas/person/PersonFilters.schema";

@injectable()
export class PersonControllerImpl {
    constructor (
        @inject(TYPES.PersonService) private personService: PersonServiceAbstract
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

            console.log(filters, req.body)

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = PersonFiltersSchema.parse(filters)

            const persons = await this.personService.getFilteredPersons(validatedFilters)

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
    async uploadPersonPack(req: Request, res: Response) {
        try {
            const dataPack = req.body
            const validatedData = PersonArrayJsonSchema.parse(dataPack)

            const { status } =  await this.personService.uploadPersonPack(validatedData.data)

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
    async deletePersons(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.personService.deletePersons(ids)

            SendResponse(res, status, status === 200 ? `Persons deleted` : status === 206 ? `Persons deleted partilly` : `Persons weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}