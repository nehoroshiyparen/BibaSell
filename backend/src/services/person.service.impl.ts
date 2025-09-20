import { Op, Sequelize } from "sequelize";
import { inject, injectable } from "inversify";
import { Person } from "#src/database/models/Person/Person.model.js";
import { TypeofPersonArraySchema } from "#src/types/schemas/person/PersonArraySchema.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";
import { RethrowApiError } from "#src/utils/ApiError/RethrowApiError.js";
import { IPersonService } from "../types/contracts/persons/person.service.interface.js";
import { TYPES } from "#src/di/types.js";
import { Reward } from "#src/database/models/Reward/Reward.model.js";
import { TypeofPersonFiltersSchema } from "#src/types/schemas/person/PersonFilters.schema.js";
import { DatabaseImpl } from "#src/database/database.impl.js";
import { moveFileToFinal } from "#src/utils/fileUtils/moveFileToFinal.js";
import { removeDir } from "#src/utils/fileUtils/remove/removeDir.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { removeFile } from "#src/utils/fileUtils/remove/removeFile.js";
import { getRelativePath } from "#src/utils/fileUtils/getRelativePath.js";
import { getSlug } from "#src/utils/slugging/getSlug.js";

@injectable()
export class PersonServiceImpl implements IPersonService {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: DatabaseImpl
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async getPersonById(id: number) {
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

            if (!person) throw ApiError.NotFound('Person not found')

            return person
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonById`, e)
        }
    }

    async getPersonBySlug(slug: string) {
        try {
            const person = await Person.findOne({
                where: { slug },
                include: [
                    {
                        model: Reward,
                        as: 'rewards',
                        through: { attributes: [] }
                    }
                ]
            })

            if (!person) throw ApiError.NotFound('Person not found')

            return person 
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonBySlug`, e)
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

    async getFilteredPersons(filters: TypeofPersonFiltersSchema, offset?: number, limit?: number): Promise<Person[] | null> {
        try {
            const where: any = {}

            if (filters.name) {
                where.name = { [Op.iLike]: `%${filters.name}%` }
            }

            if (filters.rank) {
                where.rank = { [Op.iLike]: `%${filters.rank}%`}
            }

            if (Object.keys(where).length === 0) throw ApiError.BadRequest('Invalid filter params')

            const candidates = await Person.findAll({
                where,
                offset,
                limit
            })

            return candidates
        } catch (e) {
            RethrowApiError(`Service error: Method - getFilteredPersons`, e)
        }
    }

    async bulkCreatePersons(persons: TypeofPersonArraySchema, fileConfig: FileConfig | undefined): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(persons.length / 2), 1);
        let errorCounter = 0;
    
        try {
            for (const person of persons) {
                try {
                    const filepath = fileConfig ? moveFileToFinal(fileConfig.tempDirPath, person.name, 'persons') : null
                    const image_url = filepath ? getRelativePath(filepath, 'persons') : undefined

                    const slug = getSlug(person.name)

                    await this.sequelize.transaction(async (t) => {
                        await Person.create({...person, image_url, slug }, { transaction: t });
                    });
                    
                } catch (e) {
                    console.log(`Error creating person: ${person.name}`, e);
                    removeFile(person.name, 'persons')
                    errorCounter++;
                    if (errorCounter >= errorLimit) break;
                }
            }
 
            fileConfig && removeDir(fileConfig.tempDirPath)
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                return { status: 400 };
            }
    
            return { status: 201 };
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkCreatePersons`, e);
        }
    }

    async bulkDeletePersons(ids: number[]): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(ids.length / 2), 1)
        let errorCounter = 0;
    
        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) break;

                    const person = await Person.findByPk(id)

                    if (!person) throw ApiError.NotFound(`Person with id: ${id} is not found`)

                    await this.sequelize.transaction(async (t) => {
                        await Person.destroy({
                            where: { id },
                            transaction: t
                        });
                    });

                    removeFile(person.name, 'persons', person.image_url)
                } catch (e) {
                    errorCounter++;
                    console.log(`Error while deleting person with id: ${id} \n Error: ${e}`);
                }
            }
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                return { status: 400 };
            }

            return { status: 200 };
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkDeletePersons`, e);
        }
    }
}