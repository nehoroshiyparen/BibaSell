import { Op } from "sequelize";
import { inject, injectable } from "inversify";
import { Person } from "#src/infrastructure/sequelize/models/Person/Person.model.js";
import { TypeofPersonArraySchema } from "#src/modules/persons/schemas/PersonArraySchema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { IPersonService } from "../../../types/contracts/services/persons/person.service.interface.js";
import { TYPES } from "#src/di/types.js";
import { TypeofPersonFiltersSchema } from "#src/modules/persons/schemas/PersonFilters.schema.js";
import { removeDir } from "#src/shared/files/remove/removeDir.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { getSlug } from "#src/shared/slugging/getSlug.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { PersonSequelizeRepo } from "../repositories/person.sequelize.repo.js";
import { ErrorStack } from "#src/types/interfaces/http/ErrorStack.interface.js";
import { S3PersonServiceImpl } from "./S3Person.service.impl.js";
import { generateUuid } from "#src/shared/crypto/generateUuid.js";
import { isError } from "#src/shared/typeGuards/isError.js";

@injectable()
export class PersonServiceImpl implements IPersonService {
    constructor(
        @inject(TYPES.PersonSequelizeRepo) private sequelize: PersonSequelizeRepo,
        @inject(TYPES.S3PersonService) private s3: S3PersonServiceImpl
    ) {}

    async getPersonById(id: number) {
        try {
            const person = await this.sequelize.findById(id)
            if (!person) throw ApiError.NotFound('Person not found')
            return person
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonById`, e)
        }
    }

    async getPersonBySlug(slug: string) {
        try {
            const person = await this.sequelize.findBySlug(slug)
            if (!person) throw ApiError.NotFound('Person not found')
            return person 
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonBySlug`, e)
        }
    }

    async getPersons(offset = 0, limit = 10) {
        try {
            const persons = await this.sequelize.findAll(offset, limit)
            return persons
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersons`, e)
        }
    }

    async getFilteredPersons(filters: TypeofPersonFiltersSchema, offset = 0, limit = 10): Promise<Person[] | null> {
        try {
            const where: any = {}
            if (filters.name) {
                where.name = { [Op.iLike]: `%${filters.name}%` }
            }
            if (filters.rank) {
                where.rank = { [Op.iLike]: `%${filters.rank}%`}
            }
            if (Object.keys(where).length === 0) throw ApiError.BadRequest('Invalid filter params')
            const candidates = await this.sequelize.findAll(offset, limit, where)
            return candidates
        } catch (e) {
            RethrowApiError(`Service error: Method - getFilteredPersons`, e)
        }
    }

    async bulkCreatePersons(persons: TypeofPersonArraySchema, fileConfig: FileConfig): Promise<OperationResult> {
        const errorStack: ErrorStack = {}
        let created = 0
    
        try {
            const fileMap = new Map(fileConfig.files.map(file => [file.originalname, file]))

            for (const [index, person] of persons.entries()) {
                const transaction = await this.sequelize.createTransaction()
                let S3Key: string | null = null

                try {
                    const file = fileMap.get(person.name)

                    if (file) {
                        S3Key = generateUuid()
                        await this.s3.upload(S3Key, file.buffer)
                    }

                    const slug = getSlug(person.name)!
                    await this.sequelize.create(
                        { ...person, slug },
                        S3Key ? { key: S3Key } : {},
                        transaction
                    )

                    await this.sequelize.commitTransaction(transaction)
                    created++
                } catch (e) {
                    await this.sequelize.rollbackTransaction(transaction)
                    if (S3Key) await this.s3.delete(S3Key)
                    errorStack[index] = {
                        message: isError(e) ? e.message : 'Internal error',
                        code: 'PERSON_CREATE_ERROR'
                    }
                }
            }
    
            return Object.keys(errorStack).length > 0
                ? { success: false, created, errors: errorStack }
                : { success: true, created }
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkCreatePersons`, e);
        } finally {
            fileConfig && removeDir(fileConfig.tempDirPath)
        }
    }

    async deletePerson(id: number): Promise<void> {
        const transaction = await this.sequelize.createTransaction()

        try {
            const person = await this.sequelize.findById(id)
            if (!person) throw ApiError.NotFound(`Person with id: ${id} is not found`)

            await this.sequelize.destroy(id, transaction)
            if (person.key) await this.s3.delete(person.key)
            await this.sequelize.commitTransaction(transaction)
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
            RethrowApiError(`Service error: Method - deletePerson`, e)
        }
    }

    async bulkDeletePersons(ids: number[]): Promise<OperationResult> {
        const transaction = await this.sequelize.createTransaction()
        const errorStack: ErrorStack = {}
    
        try {
            const persons = await this.sequelize.findAll()

            const foundIds = persons.map(p => p.id)
            const missingIds = ids.filter(id => foundIds.includes(id))
            for (const id of missingIds) {
                errorStack[id] = { message: `Person with id ${id} not found`, code: 'PERSON_NOT_FOUND' }
            }

            await this.sequelize.destroy(foundIds, transaction)

            for (const person of persons) {
                if (person.key) {
                    try {
                        await this.s3.delete(person.key)
                    } catch (e) {
                        errorStack[person.id] = { message: 'S3 delete failed', code: 'S3_ERROR' }
                    }
                }
            }
    
            await this.sequelize.commitTransaction(transaction)

            return Object.keys(errorStack).length > 0
                ? { success: false, errors: errorStack }
                : { success: true }
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
            throw RethrowApiError(`Service error: Method - bulkDeletePersons`, e);
        }
    }
}