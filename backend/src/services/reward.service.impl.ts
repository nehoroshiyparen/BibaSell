import { inject, injectable } from "inversify";
import { RewardServiceAbstract } from "src/types/abstractions/services/reward.service.abstraction";
import { Reward } from "src/database/models/Reward.model";
import { TypeofRewardSchema } from "src/types/schemas/reward/Reward.schema";
import { RewardArray } from "src/types/schemas/reward/RewardArray.schema";
import { RethrowApiError } from "src/utils/ApiError/RethrowApiError";
import { ApiError } from "src/utils/ApiError/ApiError";
import { Sequelize } from "sequelize";
import { TYPES } from "src/di/types";
import { DatabaseImpl } from "src/database/database.impl";

@injectable()
export class RewardServiceImpl implements RewardServiceAbstract {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: DatabaseImpl
    ) {
        this.sequelize = this.database.getDatabase()
    }

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
        const candidates = await Reward.findAll({
            where: {
                ...filters
            }
        })

        return candidates
    }

    async bulkCreateRewards(rewards: RewardArray): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(rewards.length / 2), 1);
        let errorCounter = 0;
    
        try {
            for (const reward of rewards) {
                try {
                    await this.sequelize.transaction(async (t) => {
                        await Reward.create(reward, { transaction: t });
                    });
                } catch (e) {
                    console.log(`Error creating reward: ${reward.label}`, e);
                    errorCounter++;
                    if (errorCounter >= errorLimit) break;
                }
            }
    
            if (errorCounter > 0 && errorCounter < errorLimit) {
                return { status: 206 };
            } else if (errorCounter >= errorLimit) {
                return { status: 400 };
            }
    
            return { status: 201 };
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkCreateRewards`, e);
        }
    }

    async bulkDeleteRewards(ids: number[]): Promise<{ status: number }> {
        const errorLimit = Math.floor(ids.length / 2);
        let errorCounter = 0;
    
        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) break;

                    await this.sequelize.transaction(async (t) => {
                        await Reward.destroy({
                            where: { id },
                            transaction: t
                        });
                    });
                } catch (e) {
                    errorCounter++;
                    console.log(`Error while deleting reward with id: ${id} \n Error: ${e}`);
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