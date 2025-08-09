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
        const transaction = await this.sequelize.transaction();
        const errorLimit = Math.floor(rewards.length / 2);
        let errorCounter = 0;
    
        try {
            for (const reward of rewards) {
                try {
                    if (errorCounter >= errorLimit) {
                        throw ApiError.BadRequest(`Too many failed requests, changes will be rolled back`);
                    }
    
                    await Reward.create({
                        where: { reward },
                        transaction
                    });
                } catch (e) {
                    errorCounter++;
                    console.log(`Error while creating reward: ${reward} \n Error: ${e}`);
                    
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
            throw RethrowApiError(`Service error: Method - uploadRewardPack`, e);
        }
    }

    async deleteRewards(ids: number[]): Promise<{ status: number }> {
        const transaction = await this.sequelize.transaction();
        const errorLimit = Math.floor(ids.length / 2);
        let errorCounter = 0;
    
        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) {
                        throw ApiError.BadRequest(`Too many failed requests, changes will be rolled back`);
                    }
    
                    await Reward.destroy({
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