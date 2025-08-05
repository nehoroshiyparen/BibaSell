import { Sequelize } from "sequelize";
import { inject, injectable } from "inversify";
import { Person } from "src/database/models/Person.model";
import { PersonArray } from "src/types/schemas/person/PersonArraySchema";
import { PersonFilters } from "src/types/interfaces/filters/PersonFilters.interface";
import { ApiError } from "src/utils/ApiError/ApiError";
import { RethrowApiError } from "src/utils/ApiError/RethrowApiError";
import { PersonServiceAbstract } from "../abstraction/person.service.abstraction";
import { TYPES } from "src/di/types";

@injectable()
export class PersonServiceImpl implements PersonServiceAbstract {
    constructor(
        @inject(TYPES.Sequelize) private sequelize: Sequelize
    ) {}

    async getPersonById(id: number) {
        try {
            const person = await Person.findByPk(id)

            if (!person) {
                throw ApiError.NotFound('Person not found')
            }

            return person
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonById`, e)
        }
    }

    async getPersons(offset: number, limit: number) {
        try {
            const persons = Person.findAll({
                offset,
                limit,
                where: {}
            })

            return persons
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersons`, e)
        }
    }

    async getFilteredPersons(filters: PersonFilters): Promise<Person[] | null> {
        try {
            if (!filters.name && !filters.surname && !filters.patronymic && !filters.rank) {
                throw ApiError.BadRequest(`There must be at least one filtered param`)
            }

            const candidates = await Person.findAll({
                where: {
                    ...filters
                }
            })

            return candidates
        } catch (e) {
            RethrowApiError(`Service error: Method - getFilteredPersons`, e)
        }
    }
    
    async uploadPersonPack(persons: PersonArray): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction()

        const errorLimit = Math.floor(persons.length/2)
        let errorCounter = 0

        persons.forEach(async (person) => {
            try {
                await Person.create(person, { transaction })
                if (errorCounter >= errorLimit) {
                    await transaction.rollback()
                    throw ApiError.BadRequest(`Too much failed request, data won't be saved. Changes rolled back`)
                }
            }   catch (e) {
                errorCounter++
                console.log(`Error while creating person: ${person} \n Error: ${e}`)
            }
        })

        await transaction.commit()
        return { status: errorCounter === 0 ? 200 : 206 }
    }

    async deletePersons(ids: number[]): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction()

        const errorLimit = Math.floor(ids.length/2)
        let errorCounter = 0

        ids.forEach(async (id) => {
            try {
                if (errorCounter >= errorLimit) {
                    await transaction.rollback()
                    throw ApiError.BadRequest(`Too much failed request, data won't be saved. Changes rolled back`)
                }
                await Person.destroy({
                    where: { 
                        id 
                    },
                    transaction
                })
            } catch (e) {
                errorCounter++
                console.log(`Error while deleting person with id: ${id} \n Error: ${e}`)
            }
        })
        
        await transaction.commit()
        return { status: errorCounter === 0 ? 200 : 206 }
    }
}