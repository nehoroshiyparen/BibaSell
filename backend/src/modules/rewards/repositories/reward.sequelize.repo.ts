import { TYPES } from "#src/di/types.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { Sequelize, Transaction, WhereOptions } from "sequelize";
import { TypeofRewardSchema } from "../schemas/reward/Reward.schema.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { stringifyObject } from "#src/shared/utils/stringifyObject.js";
import { generateUuid } from "#src/shared/crypto/generateUuid.js";
import { BaseSequelizeRepo } from "#src/infrastructure/sequelize/base.sequelize-repo.js";

@injectable()
export class RewardSequelizeRepo extends BaseSequelizeRepo<Reward> {
    constructor(
        @inject(TYPES.Database) private database: IDatabase,
        @inject(TYPES.SequelizeLogger) protected logger: StoreLogger
    ) {
        super(database.getDatabase(), Reward, logger)
    }

    async create(
        data: TypeofRewardSchema & { slug: string },
        options?: { key?: string },
        transaction?: Transaction
    ): Promise<Reward> {
        const reward = await Reward.create(
            { ...data, ...options },
            { transaction }
        )
        this.logger.operations.created(stringifyObject(reward), reward.id)
        return reward
    }
}