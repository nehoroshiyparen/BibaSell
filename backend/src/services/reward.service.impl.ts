import { inject, injectable } from "inversify";
import { RewardServiceAbstract } from "#src/types/abstractions/services/reward.service.abstraction.js";
import { Reward } from "#src/database/models/Reward.model.js";
import { TypeofRewardSchema } from "#src/types/schemas/reward/Reward.schema.js";
import { RewardArray } from "#src/types/schemas/reward/RewardArray.schema.js";
import { RethrowApiError } from "#src/utils/ApiError/RethrowApiError.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";
import { Sequelize } from "sequelize";
import { TYPES } from "#src/di/types.js";
import { DatabaseImpl } from "#src/database/database.impl.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface";
import { moveFileToFinal } from "#src/utils/fileHandlers/moveFileToFinal";
import { removeFile } from "#src/utils/fileHandlers/removeFile";
import { removeDir } from "#src/utils/fileHandlers/removeDir";

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

    async bulkCreateRewards(rewards: RewardArray, fileConfig: FileConfig | undefined): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(rewards.length / 2), 1);
        let errorCounter = 0;
    
        try {
            for (const reward of rewards) {
                try {
                    const image_url = fileConfig ? moveFileToFinal(fileConfig.tempDirPath, reward.label, 'rewards') : null

                    await this.sequelize.transaction(async (t) => {
                        await Reward.create({ ...reward, image_url }, { transaction: t });
                    });
                } catch (e) {
                    console.log(`Error creating reward: ${reward.label}`, e);
                    removeFile(reward.label, 'rewards')
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
            throw RethrowApiError(`Service error: Method - bulkCreateRewards`, e);
        }
    }

    async bulkDeleteRewards(ids: number[]): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(ids.length / 2), 1);
        let errorCounter = 0;
    
        try {
            for (const id of ids) {
                try {
                    if (errorCounter >= errorLimit) break;

                    const reward = await Reward.findByPk(id)

                    if (!reward) throw ApiError.BadRequest(`Reward with id: ${id} is not found`)

                    await this.sequelize.transaction(async (t) => {
                        await Reward.destroy({
                            where: { id },
                            transaction: t
                        });
                    });

                    removeFile(reward.label, 'rewards', reward.image_url)
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