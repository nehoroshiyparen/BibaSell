import { Op, where } from "sequelize";
import { inject, injectable } from "inversify";
import { Person } from "#src/infrastructure/sequelize/models/person.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
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
import path from "path";
import { readFile } from "#src/shared/files/utils/readFile.js";
import { PersonMapper } from "../mappers/person.mapper.js";
import { TypeofPersonPreviewSchema } from "../schemas/PersonPreview.schema.js";
import { TypeofPersonFullSchema } from "../schemas/PersonFull.schema.js";
import { IBaseService } from "#src/types/contracts/services/module.service.interface.js";
import { IPersonService } from "#src/types/contracts/services/person.service.interface.js";
import { TypeofPersonSchema } from "../schemas/Person.schema.js";

@injectable()
export class PersonServiceImpl implements IPersonService {
    constructor(
        @inject(TYPES.PersonSequelizeRepo) private sequelize: PersonSequelizeRepo,
        @inject(TYPES.S3PersonService) private s3: S3PersonServiceImpl,
        @inject(TYPES.PersonMapper) private mapper: PersonMapper,
    ) {}

    async getById(id: number): Promise<TypeofPersonFullSchema> {
        try {
            const person = await this.sequelize.findById(id)
            if (!person) throw ApiError.NotFound('Person not found')
            return await this.mapper.toFull(person)
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonById`, e)
        }
    }

    async getBySlug(slug: string): Promise<TypeofPersonFullSchema> {
        try {
            const person = await this.sequelize.findBySlug(slug)
            if (!person) throw ApiError.NotFound('Person not found')
            return await this.mapper.toFull(person)
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonBySlug`, e)
        }
    }

    async getList(
        offset = 0,
        limit = 10,
        filters: Partial<TypeofPersonFiltersSchema> = {},
    ): Promise<TypeofPersonPreviewSchema[]> {
        try {
            const where: any = {}

            // строим фильтры только если они переданы
            if (filters.name) where.name = { [Op.iLike]: `%${filters.name}%` }
            if (filters.rank) where.rank = { [Op.iLike]: `%${filters.rank}%` }

            let persons: Person[]

            if (Object.keys(where).length) {
            // есть фильтры → используем их
            persons = await this.sequelize.findAll({offset, limit, where})
            } else {
            // нет фильтров → отдаём всё
            persons = await this.sequelize.findAll({offset, limit})
            }

            return await this.mapper.toPreview(persons)
        } catch (e) {
            RethrowApiError(`Service error: Method - getPersonsFiltered`, e)
        }
    }

    async bulkCreate(persons: TypeofPersonSchema[], fileConfig: FileConfig): Promise<OperationResult> {
        const errorStack: ErrorStack = {};
        let personRewardsErrorStack: ErrorStack | null = {};
        let created = 0
    
        try {
            const images = fileConfig.files.images as Express.Multer.File[]
            const fileMap = new Map(
                images?.map(file => [path.parse(file.originalname).name, file])
            )

            for (const [_, person] of persons.entries()) {
                const transaction = await this.sequelize.createTransaction()
                let S3Key: string | null = null
                let buffer: Buffer | null = null

                try {
                    const file = fileMap.get(person.name)

                    if (file) {
                        S3Key = generateUuid()
                        buffer = await readFile(file.path)
                    }

                    const slug = getSlug(person.name)!
                    const createdPerson = await this.sequelize.create(
                        { ...person, slug },
                        S3Key ? { key: S3Key } : {},
                        transaction
                    )

                    personRewardsErrorStack = person.rewards && person.rewards.length > 0 ? await this.sequelize.createPersonsRewrads({ person_id: createdPerson.id, rewards: person.rewards }, { transaction }) : null

                    if (S3Key && buffer && file)  {
                        await this.s3.upload(S3Key, buffer, { 
                            contentType: file.mimetype,
                        })
                    }

                    await this.sequelize.commitTransaction(transaction)
                    created++
                } catch (e) {
                    await this.sequelize.rollbackTransaction(transaction)

                    let message = 'Internal error'
                    if (isError(e)) {
                        message = e.message
                        const pgError = (e as any).original
                        if (pgError?.detail) {
                            message += ` - ${pgError.detail}`
                        }
                    }
                    
                    errorStack[person.name] = {
                        message,
                        personRewardsErrorStack,
                        code: 'PERSON_CREATE_ERROR'
                    }
                }
            }
            fileConfig && removeDir(fileConfig.tempDirPath)
    
            return Object.keys(errorStack).length > 0
                ? { success: false, created, errors: errorStack }
                : { success: true, created }
        } catch (e) {
            fileConfig && removeDir(fileConfig.tempDirPath)
            throw RethrowApiError(`Service error: Method - bulkCreatePersons`, e);
        }
    }

    async delete(id: number): Promise<void> {
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

    async bulkDelete(ids: number[]): Promise<OperationResult> {
        const transaction = await this.sequelize.createTransaction()
        const errorStack: ErrorStack = {};
    
        try {
            const persons = await this.sequelize.findAll({where: { id: ids }})

            const foundIds = persons.map(p => p.id)
            const missingIds = ids.filter(id => !foundIds.includes(id));
            for (const id of missingIds) {
                errorStack[id] = { message: `Person with id ${id} not found`, code: 'PERSON_NOT_FOUND' }
            }

            if (foundIds.length > 0) {
                await this.sequelize.destroy(foundIds, transaction)
            }

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
            RethrowApiError(`Service error: Method - bulkDeletePersons`, e);
        }
    }

    private async modifyObject(model: Person, key?: string) {
        if (!key) return model
        const urls = await this.s3.getSignedUrls([key])
        return { ...model.toJSON(), key: urls[key] }
    }
}