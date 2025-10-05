import { TYPES } from "#src/di/types.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { FindOptions, Transaction, WhereOptions } from "sequelize";
import { Person } from "#src/infrastructure/sequelize/models/Person/Person.model.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";
import { TypeofPersonSchema } from "../schemas/Person.schema.js";
import { BaseSequelizeRepo } from "#src/infrastructure/sequelize/base.sequelize-repo.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";

@injectable()
export class PersonSequelizeRepo extends BaseSequelizeRepo<Person> {
    constructor(
        @inject(TYPES.Database) private database: IDatabase,
        @inject(TYPES.SequelizeLogger) protected logger: StoreLogger
    ) {
        super(database.getDatabase(), Person, logger)
    }

    async create(
        data: TypeofPersonSchema & { slug: string }, 
        options?: { key?: string }, 
        transaction?: Transaction
    ): Promise<Person> {
        const person = await Person.create({
            ...data,
            ...options,
        }, { transaction })
        return person
    }

    protected getFindByIdOptions(): FindOptions | undefined {
        return {
            include: [
                {
                    model: Reward,
                    as: 'rewards',
                    through: { attributes: [] }
                }
            ]
        }
    }

    protected getBySlugOptions(): FindOptions | undefined {
        return {
            include: [
                {
                    model: Reward,
                    as: 'rewards',
                    through: { attributes: [] }
                }
            ]
        }
    }
}