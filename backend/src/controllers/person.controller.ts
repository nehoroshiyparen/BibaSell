import { Request, Response } from "express";
import { PersonArraySchema, PersonArray  } from '../types/schemas/person/PersonArraySchema'
import { SendError, SendResponse } from "src/utils/http";
import { status } from "src/consts/status";
import { PersonFilters } from "src/types/interfaces/filters/PersonFilters.interface";
import { PersonServiceAbstract } from "src/services";
import { injectable, inject } from "inversify";
import { TYPES } from "src/di/types";

@injectable()
export class PersonControllerImpl {
    constructor (
        @inject(TYPES.PersonService) private personService: PersonServiceAbstract
    ) {}

    async getPersonById(req: Request, res: Response) {
        try {
            const id = Number(req.params)

            const person = await this.personService.getPersonById(id)

            SendResponse(res, status.OK, `Person fetched`, person)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getPersons(req: Request, res: Response) {
        try {
            const offset = Number(req.query.offset)
            const limit = Number(req.query.limit)

            const persons = await this.personService.getPersons(offset, limit)

            SendResponse(res, status.OK, persons ? `Persons fetched` : `No more data`, persons)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getFilteredPersons(req: Request, res: Response) {
        try {
            const filters: PersonFilters = {
                name: String(req.query.name),
                surname: String(req.query.surname),
                patronymic: String(req.query.patronymic),
                rank: String(req.query.rank),
            }

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
     */
    async deletePersons(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)

            const { status } = await this.personService.deletePersons(ids)

            SendResponse(res, status, status === 200 ? `Persons deleted` : `Persons deleted partilly`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}