import { TYPES } from "#src/di/types.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { Sequelize, Transaction, WhereOptions } from "sequelize";
import { TypeofRewardSchema } from "../schemas/reward/Reward.schema.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";

@injectable()
export class RewardSequelizeRepo {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: IDatabase
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async createReward(data: TypeofRewardSchema & { slug: string }, options?: { key?: string }, transaction?: Transaction): Promise<Reward> {
        const reward = await Reward.create({
            ...data,
            ...options
        }, { transaction })
        return reward
    }

    async findById(id: number): Promise<Reward | null> {
        const reward = await Reward.findByPk(id)
        return reward
    }

    async findBySlug(slug: string): Promise<Reward | null> {
        const reward = Reward.findOne({
            where: { slug }
        })
        return reward
    }

    async findAll(offset?: number, limit?: number, where?: WhereOptions<any>): Promise<Reward[]> {
        const options: any = { where }

        if (offset !== undefined) options.offset = offset
        if (limit !== undefined) options.limit = limit

        const candidates = await Reward.findAll(options)
        return candidates
    }

    async destroy(id: number | number[], transaction?: Transaction) {
        await Reward.destroy({ where: { id }, transaction })
    }

    async createTransaction(): Promise<Transaction> {
        return await this.sequelize.transaction()
    }
}