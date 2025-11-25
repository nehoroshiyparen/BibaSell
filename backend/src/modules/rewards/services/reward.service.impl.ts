import { inject, injectable } from "inversify";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Op } from "sequelize";
import { TYPES } from "#src/di/types.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { removeDir } from "#src/shared/files/remove/removeDir.js";
import { getSlug } from "#src/shared/slugging/getSlug.js";
import { generateUuid } from "#src/shared/crypto/generateUuid.js";
import { S3RewardServiceImpl } from "./S3Reward.service.impl.js";
import { RewardSequelizeRepo } from "../repositories/reward.sequelize.repo.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { ErrorStack } from "#src/types/interfaces/http/ErrorStack.interface.js";
import { isError } from "#src/shared/typeGuards/isError.js";
import { readFile } from "#src/shared/files/utils/readFile.js";
import path from "path";
import { RewardMapper } from "../mappers/reward.mapper.js";
import { TypeofRewardFullSchema } from "../schemas/reward/RewardFull.schema.js";
import { TypeofRewardPreviewSchema } from "../schemas/reward/RewardPreview.schema.js";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js";
import { TypeofRewardFiltersSchema } from "../schemas/reward/RewardFilters.schema.js";
import { TypeofRewardSchema } from "../schemas/reward/Reward.schema.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";

@injectable()
export class RewardServiceImpl implements IRewardService {
    constructor(
        @inject(TYPES.RewardSequelizeRepo) private sequelize: RewardSequelizeRepo,
        @inject(TYPES.S3RewardService) private s3: S3RewardServiceImpl,
        @inject(TYPES.RewardMapper) private mapper: RewardMapper
    ) {}

    async getById(id: number): Promise<TypeofRewardFullSchema> {
        try {
            const reward = await this.sequelize.findById(id)
            if (!reward) throw ApiError.NotFound(`Reward not found`)
            return await this.mapper.toFull(reward)
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewardById`, e)
        }
    }

    async getBySlug(slug: string): Promise<TypeofRewardFullSchema> {
        try {
            const reward = await this.sequelize.findBySlug(slug)
            if (!reward) throw ApiError.NotFound(`Reward not found`)
            return await this.mapper.toFull(reward)
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewards`, e)
        }
    }

    async getList(
        offset = 0,
        limit = 10,
        filters: Partial<TypeofRewardFiltersSchema> = {},
    ): Promise<TypeofRewardPreviewSchema[]> {
        try {
            const where: any = {}

            if (filters.label) where.label = { [Op.iLike]: `%${filters.label}%` }

            let rewards: Reward[]

            if (Object.keys(where).length) {
                rewards = await this.sequelize.findAll(offset, limit, where)
            } else {
                rewards = await this.sequelize.findAll(offset, limit)
            }

            return await this.mapper.toPreview(rewards)
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewardsFiltered`, e)
        }
    }

    async bulkCreate(rewards: TypeofRewardSchema[], fileConfig: FileConfig): Promise<OperationResult> {
        const errorStack: ErrorStack = {}
        let created = 0
    
        try {
            const images = fileConfig.files.images as Express.Multer.File[]
            const fileMap = new Map(
                images.map(file => [path.parse(file.originalname).name, file])
            )

            for (const [_, reward] of rewards.entries()) {
                const transaction = await this.sequelize.createTransaction()

                try {
                    const file = fileMap.get(reward.label)
                    let S3Key: string | null = null
                    let buffer: Buffer | null = null

                    if (file) {
                        S3Key = generateUuid()
                        buffer = await readFile(file.path)
                    }

                    const slug = getSlug(reward.label)!
                    await this.sequelize.create(
                        { ...reward, slug }, 
                        S3Key ? { key: S3Key } : {}, 
                        transaction
                    )

                    if (S3Key && buffer && file) {
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

                    errorStack[reward.label] = {
                        message,
                        code: 'REWARD_CREATE_ERROR'
                    }
                }
            }
    
            return Object.keys(errorStack).length > 0
                ? { success: false, created, errors: errorStack }
                : { success: true, created }
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkCreateRewards`, e);
        } finally {
            fileConfig && removeDir(fileConfig.tempDirPath)
        }
    }

    async delete(id: number): Promise<void> {
        const transaction = await this.sequelize.createTransaction()

        try {
            const reward = await this.sequelize.findById(id)
            if (!reward) throw ApiError.NotFound(`Reward with id: ${id} is not found`)

            await this.sequelize.destroy(id, transaction)
            if (reward.key) await this.s3.delete(reward.key)
            await this.sequelize.commitTransaction(transaction)    
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
            throw RethrowApiError(`Service error: Method - deleteReward`, e);
        }
    }

    async bulkDelete(ids: number[]): Promise<OperationResult> {
        const transaction = await this.sequelize.createTransaction()
        const errorStack: any = null
    
        try {
            const rewards = await this.sequelize.findAll()

            const foundIds = rewards.map(r => r.id)
            const missingIds = ids.filter(id => !foundIds.includes(id))
            for (const id of missingIds) {
                errorStack[id] = { message: `Reward with id ${id} not found`, code: 'REWARD_NOT_FOUND' }
            }

            await this.sequelize.destroy(foundIds, transaction)

            for (const reward of rewards) {
                if (reward.key) {
                    try {
                        await this.s3.delete(reward.key)
                    } catch (e) {
                        errorStack[reward.id] = { message: 'S3 delete failed', code: 'S3_ERROR' }
                    }
                }
            }

            await this.sequelize.commitTransaction(transaction)

            return Object.keys(errorStack).length > 0
                ? { success: false, errors: errorStack }
                : { success: true }
        } catch (e) {
            await this.sequelize.rollbackTransaction(transaction)
            throw RethrowApiError(`Service error: Method - bulkDeleteRewards`, e);
        }
    }
}