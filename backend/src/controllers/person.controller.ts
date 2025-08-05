import { Request, Response } from "express";
import { PersonArraySchema, PersonArray  } from '../types/schemas/person/PersonArraySchema'
import { SendError, SendResponse } from "src/utils/http";
import { status } from "src/consts/status";
import { PersonFilters } from "src/types/interfaces/filters/PersonFilters.interface";
import { PersonServiceAbstract } from "src/types/abstractions/services/person.service.abstraction";
import { injectable, inject } from "inversify";
import { TYPES } from "src/di/types";
import { ApiError } from "src/utils/ApiError/ApiError";

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

            if (isNaN(id) || id < 1) throw ApiError.BadRequest('Invalid person id')

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

            if (offset < 0 || limit < 0) throw ApiError.BadRequest('Offset and limit must be positive numbers')

            const persons = await this.personService.getPersons(offset, limit)

            SendResponse(res, status.OK, persons ? `Persons fetched` : `No more data`, persons)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Возвращает массив объектов Person по указанным фильтрам
     * @param req В query запроса указываются параметры для фильтрации. Параметры могут быть любым свойством Person
     * @param res 
     * @throws {BadRequest} Если ни один параметр фильтрации не указан
     * @throws {Internal} Если возникает непредсказанная ошибка
     */
    async getFilteredPersons(req: Request, res: Response) {
        try {
            const filters: PersonFilters = {
                name: String(req.query.name),
                surname: String(req.query.surname),
                patronymic: String(req.query.patronymic),
                rank: String(req.query.rank),
            }

            if (Object.values(filters).every(val => !val))  throw ApiError.BadRequest(`There must be at least one filtered param`)

            const persons = await this.personService.getFilteredPersons(filters)

            SendResponse(res, status.OK, persons ? `Persons fetched` : `No candidates found`, persons)
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
            const validatedData: PersonArray = PersonArraySchema.parse(dataPack)

            const { status } =  await this.personService.uploadPersonPack(validatedData)

            SendResponse(res, status, status === 200 ? `Person data pack uploaded` : `Person data pack uploaded partially`, null)
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

            if (!ids.length) throw ApiError.BadRequest('No id provided for deletion')
            if (ids.some(id => isNaN(id) || id < 1)) throw ApiError.BadRequest('All id must be positive numbers')

            const { status } = await this.personService.deletePersons(ids)

            SendResponse(res, status, status === 200 ? `Persons deleted` : `Persons deleted partilly`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}