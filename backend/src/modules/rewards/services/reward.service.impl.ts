import { inject, injectable } from "inversify";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";
import { TypeofRewardSchema } from "#src/modules/rewards/schemas/reward/Reward.schema.js";
import { RewardArray } from "#src/modules/rewards/schemas/reward/RewardArray.schema.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Op, Sequelize } from "sequelize";
import { TYPES } from "#src/di/types.js";
import { DatabaseImpl } from "#src/infrastructure/sequelize/database.impl.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { moveFileToFinal } from "#src/shared/fileUtils/moveFileToFinal.js";
import { removeFile } from "#src/shared/fileUtils/remove/removeFile.js";
import { removeDir } from "#src/shared/fileUtils/remove/removeDir.js";
import { getRelativePath } from "#src/shared/fileUtils/getRelativePath.js";
import { getSlug } from "#src/shared/slugging/getSlug.js";

@injectable()
export class RewardServiceImpl implements IRewardService {
    private sequelize: Sequelize

    constructor(
        @inject(TYPES.Database) private database: DatabaseImpl
    ) {
        this.sequelize = this.database.getDatabase()
    }

    async getRewardById(id: number): Promise<Reward> {
        try {
            const reward = await Reward.findByPk(id)

            if (!reward) throw ApiError.NotFound(`Reward not found`)

            return reward
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewardById`, e)
        }
    }

    async getRewardBySlug(slug: string): Promise<Reward> {
        try {
            const reward = await Reward.findOne({
                where: { slug }
            })

            if (!reward) throw ApiError.NotFound(`Reward not found`)

            return reward 
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewards`, e)
        }
    }

    async getRewards(offset: number, limit: number): Promise<Reward[] | null> {
        try {
            const rewards = await Reward.findAll({
                offset,
                limit,
                where: {},
                attributes: ['id', 'slug', 'label', 'image_url']
            })

            return rewards
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewards`, e)
        }
    }

    async getFilteredRewards(filters: TypeofRewardSchema, offset?: number, limit?: number): Promise<Reward[] | null> {
        try {
            const where: any = {}

            if (filters.label) {
                where.label = { [Op.iLike]: `%${filters.label}%` }
            }
            
            const candidates = await Reward.findAll({
                where,
                offset,
                limit
            })

            return candidates
        } catch (e) {
            RethrowApiError(`Service error: Method - getFilteredRewards`, e)
        }
    }

    async bulkCreateRewards(rewards: RewardArray, fileConfig: FileConfig | undefined): Promise<{ status: number }> {
        const errorLimit = Math.max(Math.floor(rewards.length / 2), 1);
        let errorCounter = 0;
    
        try {
            for (const reward of rewards) {
                try {
                    const filepath = fileConfig ? moveFileToFinal(fileConfig.tempDirPath, reward.label, 'rewards') : null
                    const image_url = filepath ? getRelativePath(filepath, 'rewards') : undefined 

                    const slug = getSlug(reward.label)

                    await this.sequelize.transaction(async (t) => {
                        await Reward.create({ ...reward, image_url, slug }, { transaction: t });
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