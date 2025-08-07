import { inject, injectable } from "inversify";
import { RewardServiceAbstract } from "src/types/abstractions/services/reward.service.abstraction";
import { Reward } from "src/database/models/Reward.model";
import { TypeofRewardSchema } from "src/types/schemas/reward/Reward.schema";
import { RewardArray } from "src/types/schemas/reward/RewardArray.schema";
import { RethrowApiError } from "src/utils/ApiError/RethrowApiError";
import { ApiError } from "src/utils/ApiError/ApiError";
import { Sequelize } from "sequelize";
import { TYPES } from "src/di/types";

@injectable()
export class RewardServiceImpl implements RewardServiceAbstract {
    constructor(
        @inject(TYPES.Sequelize) private sequelize: Sequelize
    ) {}

    async getRewardById(id: number): Promise<Reward> {
        try {
            const reward = await Reward.findByPk(id)

            if (!reward) {
                throw ApiError.NotFound(`Reward not found`)
            }

            return reward
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewardById`, e)
        }
    }

    async getRewards(offset: number, limit: number): Promise<Reward[] | null> {
        try {
            const rewards = await Reward.findAll({
                offset,
                limit,
                where: {}
            })

            return rewards
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewards`, e)
        }
    }

    async getFilteredRewards(filters: TypeofRewardSchema): Promise<Reward[] | null> {
        if (!(
            filters.addition && 
            filters.count && 
            filters.description && 
            filters.label && 
            filters.realeseDate
        )) throw ApiError.BadRequest(`There must be at least one filtered param`)

        const candidates = await Reward.findAll({
            where: {
                ...filters
            }
        })

        return candidates
    }

    async uploadRewardPack(rewards: RewardArray): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction()

        const errorLimit = Math.floor(rewards.length/2)
        let errorCounter = 0

        rewards.forEach(async (reward) => {
            try {
                await Reward.create(reward, { transaction })
                if (errorCounter >= errorLimit) {
                    await transaction.rollback()
                    throw ApiError.BadRequest(`Too much failed request, data won't be saved. Changes rolled back`)
                }
            }   catch (e) {
                errorCounter++
                console.log(`Error while creating reward: ${reward} \n Error: ${e}`)
            }
        })

        await transaction.commit()
        return { status: errorCounter === 0 ? 200 : 206 }
    }

    async deleteRewards(ids: number[]): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction()

        const errorLimit = Math.floor(ids.length/2)
        let errorCounter = 0

        ids.forEach(async (id) => {
            try {
                if (errorCounter >= errorLimit) {
                    await transaction.rollback()
                    throw ApiError.BadRequest(`Too much failed request, data won't be saved. Changes rolled back`)
                }
                await Reward.destroy({
                    where: { 
                        id 
                    },
                    transaction
                })
            } catch (e) {
                errorCounter++
                console.log(`Error while deleting reward with id: ${id} \n Error: ${e}`)
            }
        })
        
        await transaction.commit()
        return { status: errorCounter === 0 ? 200 : 206 }
    }
}