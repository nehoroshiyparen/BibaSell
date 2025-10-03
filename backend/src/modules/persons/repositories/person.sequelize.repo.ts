import { TYPES } from "#src/di/types.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { Sequelize, Transaction, WhereOptions } from "sequelize";
import { Person } from "#src/infrastructure/sequelize/models/Person/Person.model.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";
import { TypeofPersonSchema } from "../schemas/Person.schema.js";

@injectable()
export class PersonSequelizeRepo {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: IDatabase
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async create(data: TypeofPersonSchema & { slug: string }, options?: { key?: string }, transaction?: Transaction): Promise<Person> {
        const person = await Person.create({
            ...data,
            ...options,
        }, { transaction })
        return person
    }

    async findById(id: number): Promise<Person | null> {
        const person = await Person.findByPk(id, {
            include: [
                {
                    model: Reward,
                    as: 'rewards',
                    through: { attributes: [] }
                }
            ]
        })
        return person
    }

    async findBySlug(slug: string): Promise<Person | null> {
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
        return person
    }

    async findAll(offset?: number, limit?: number, where?: WhereOptions<any>): Promise<Person[]> {
        const options: any = { where }

        if (offset !== undefined) options.offset = offset
        if (limit !== undefined) options.limit = limit

        const candidates = await Person.findAll(options)
        return candidates
    }

    async destroy(id: number | number[], transaction?: Transaction): Promise<void> {
        await Person.destroy({ where: { id }, transaction })
    }

    async createTransaction(): Promise<Transaction> {
        return await this.sequelize.transaction()
    }
}