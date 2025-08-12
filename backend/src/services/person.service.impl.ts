import { Sequelize } from "sequelize";
import { inject, injectable } from "inversify";
import { Person } from "src/database/models/Person.model";
import { TypeofPersonArraySchema } from "src/types/schemas/person/PersonArraySchema";
import { ApiError } from "src/utils/ApiError/ApiError";
import { RethrowApiError } from "src/utils/ApiError/RethrowApiError";
import { PersonServiceAbstract } from "../types/abstractions/services/person.service.abstraction";
import { TYPES } from "src/di/types";
import { Reward } from "src/database/models/Reward.model";
import { TypeofPersonFiltersSchema } from "src/types/schemas/person/PersonFilters.schema";
import { DatabaseImpl } from "src/database/database.impl";

@injectable()
export class PersonServiceImpl implements PersonServiceAbstract {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: DatabaseImpl
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async getPersonById(id: number) {
        console.log(id)

        try {
            const person = await Person.findByPk(id, {
                include: [
                    {
                        model: Reward,
                        as: 'rewards',
                        through: { attributes: [] }
                    }
                ]
            })

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

    async getFilteredPersons(filters: TypeofPersonFiltersSchema): Promise<Person[] | null> {
        try {
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
    
    async uploadPersonPack(persons: TypeofPersonArraySchema): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction();
        const errorLimit = Math.floor(persons.length / 2);
        let errorCounter = 0;
    
        try {
            for (const person of persons) {
                try {
                    if (errorCounter >= errorLimit) {
                        throw ApiError.BadRequest(`Too many failed requests, changes will be rolled back`);
                    }
    
                    await Person.create({
                        where: { persons },
                        transaction
                    });
                } catch (e) {
                    errorCounter++;
                    console.log(`Error while creating person: ${person} \n Error: ${e}`);
                    
                    if (errorCounter >= errorLimit) {
                        break;
                    }
                }
            }
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                await transaction.commit();
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                await transaction.rollback();
                return { status: 400 };
            }
    
            await transaction.commit();
            return { status: 201 };
        } catch (e) {
            await transaction.rollback();
            throw RethrowApiError(`Service error: Method - deletePersons`, e);
        }
    }

    async deletePersons(ids: number[]): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction();
        const errorLimit = Math.floor(ids.length / 2);
        let errorCounter = 0;
    
        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) {
                        throw ApiError.BadRequest(`Too many failed requests, changes will be rolled back`);
                    }
    
                    await Person.destroy({
                        where: { id },
                        transaction
                    });
                } catch (e) {
                    errorCounter++;
                    console.log(`Error while deleting person with id: ${id} \n Error: ${e}`);
                    
                    if (errorCounter >= errorLimit) {
                        break;
                    }
                }
            }
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                await transaction.commit();
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                await transaction.rollback();
                return { status: 400 };
            }
    
            await transaction.commit();
            return { status: 200 };
        } catch (e) {
            await transaction.rollback();
            throw RethrowApiError(`Service error: Method - deletePersons`, e);
        }
    }
}