import { inject, injectable } from "inversify";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";
import { TypeofRewardSchema } from "#src/modules/rewards/schemas/reward/Reward.schema.js";
import { RewardArray } from "#src/modules/rewards/schemas/reward/RewardArray.schema.js";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { Op, Sequelize } from "sequelize";
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

@injectable()
export class RewardServiceImpl implements IRewardService {
    constructor(
        @inject(TYPES.RewardSequelizeRepo) private sequelize: RewardSequelizeRepo,
        @inject(TYPES.S3RewardService) private s3: S3RewardServiceImpl
    ) {}

    async getRewardById(id: number): Promise<Reward> {
        try {
            const reward = await this.sequelize.findById(id)
            if (!reward) throw ApiError.NotFound(`Reward not found`)
            return await this.modifyObject(reward, reward.key)
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewardById`, e)
        }
    }

    async getRewardBySlug(slug: string): Promise<Reward> {
        try {
            const reward = await this.sequelize.findBySlug(slug)
            if (!reward) throw ApiError.NotFound(`Reward not found`)
            return await this.modifyObject(reward, reward.key) 
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewards`, e)
        }
    }

    async getRewards(offset = 0, limit = 10): Promise<Reward[] | null> {
        try {
            const rewards = await this.sequelize.findAll(offset, limit)

            const modifiedPersons = await Promise.all(
                rewards.map((reward) => this.modifyObject(reward, reward.key))
            )

            return modifiedPersons
        } catch (e) {
            RethrowApiError(`Service error: Method - getRewards`, e)
        }
    }

    async getFilteredRewards(filters: TypeofRewardSchema, offset = 0, limit = 10): Promise<Reward[] | null> {
        try {
            const where: any = {}

            if (filters.label) {
                where.label = { [Op.iLike]: `%${filters.label}%` }
            }
            
            const candidates = await this.sequelize.findAll(offset, limit, where)

            const modifiedCandidates = await Promise.all(
                candidates.map((candidate) => this.modifyObject(candidate, candidate.key))
            )

            return modifiedCandidates
        } catch (e) {
            RethrowApiError(`Service error: Method - getFilteredRewards`, e)
        }
    }

    async bulkCreateRewards(rewards: RewardArray, fileConfig: FileConfig): Promise<OperationResult> {
        const errorStack: ErrorStack = {}
        let created = 0
    
        try {
            const fileMap = new Map(
                fileConfig.files.map(file => [path.parse(file.originalname).name, file])
            )

            for (const [index, reward] of rewards.entries()) {
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
                            ACL: 'public-read'
                        })
                    }

                    await this.sequelize.commitTransaction(transaction)
                    created++
                } catch (e) {
                    await this.sequelize.rollbackTransaction(transaction)

                    errorStack[index] = {
                        message: isError(e) ? e.message : 'Internal error',
                        code: 'REWARD_CREATE_ERROR'
                    }
                }
            }
            fileConfig && removeDir(fileConfig.tempDirPath)
    
            return Object.keys(errorStack).length > 0
                ? { success: false, created, errors: errorStack }
                : { success: true, created }
        } catch (e) {
            throw RethrowApiError(`Service error: Method - bulkCreateRewards`, e);
        } finally {
            fileConfig && removeDir(fileConfig.tempDirPath)
        }
    }

    async deleteReward(id: number): Promise<void> {
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

    async bulkDeleteRewards(ids: number[]): Promise<OperationResult> {
        const transaction = await this.sequelize.createTransaction()
        const errorStack: ErrorStack = {}
    
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

    private async modifyObject(model: Reward, key?: string) {
        if (!key) return model
        const urls = await this.s3.getSignedUrls([key])
        return { ...model.toJSON(), key: urls[key] }
    }
}