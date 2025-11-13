import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "#src/di/types.js";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js"; 
import { RewardArraySchema } from "#src/modules/rewards/schemas/reward/RewardArray.schema.js";
import { SendError, SendResponse } from "#src/lib/http/index.js";
import { ValidateObjectFieldsNotNull } from "#src/shared/validations/objectFieldsNotNull.validate.js";
import { ValidateId } from "#src/shared/validations/ids/id.validate.js";
import { ValidateIdArray } from "#src/shared/validations/ids/idArray.validate.js";
import { ValidatePaginationParams } from "#src/shared/validations/paginationParams.validate.js";
import { RewardFiltersSchema, TypeofRewardFiltersSchema } from "#src/modules/rewards/schemas/reward/RewardFilters.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { status } from "#src/consts/status.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";

@injectable()
export class RewardControllerImpl {
    constructor (
        @inject(TYPES.RewardService) private rewardService: IRewardService
    ) {}

    async getRewardById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const reward = await this.rewardService.getById(id)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: 'Reward fetched'
                    },
                ],
                data: reward
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async getRewardBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)

            const reward = await this.rewardService.getBySlug(slug)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: 'Reward fetched'
                    }
                ],
                data: reward
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async getRewards(req: Request, res: Response) {
        try {
            const offset = Number(req.query.offset) || 0
            const limit = Math.min(Number(req.query.limit) || 20, 100)

            ValidatePaginationParams(offset, limit)

            const filters: Partial<TypeofRewardFiltersSchema> = {
                label: req.query.label?.toString(),
            }

            const rewards = await this.rewardService.getList(offset, limit, filters)

            SendResponse(res, {
            cases: [
                {
                condition: () => true,
                status: status.OK,
                message: rewards?.length !== 0 ? 'Rewards fetched' : 'No candidates found'
                }
            ],
            data: rewards
            })
        } catch (e) {
            SendError(res, e)
        }
    }
    async bulkCreateRewards(req: Request, res: Response) {
        try {
            if (!req.body.data) {
                throw ApiError.BadRequest('Missing data field in body')
            }
            if (!req.tempUploadDir) {
                throw ApiError.Internal('Server has not prepared necessary dirs')
            }

            const dataPack = JSON.parse(req.body.data)
        
            const validatedData = RewardArraySchema.parse(dataPack)

            const files = req.files as Record<string, Express.Multer.File[]>
            const imageFiles: Express.Multer.File[] = files.images

            const fileConfig: FileConfig | undefined = {
                tempDirPath: req.tempUploadDir,
                files: {
                    images: imageFiles,
                }
            }

            const bulkCreateResult = await this.rewardService.bulkCreate(validatedData, fileConfig)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => bulkCreateResult.created === dataPack.length,
                        status: status.OK,
                        message: 'Rewards created'
                    },
                    {
                        condition: () => bulkCreateResult.created > 0,
                        status: status.PARTIAL_CONTENT,
                        message: 'Rewards created partilly'
                    },
                    {
                        condition: () => true,
                        status: status.BAD_REQUEST,
                        message: 'Rewards were not created. Too much invalid data'
                    }
                ],
                data: bulkCreateResult
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async deleteReward(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            await this.rewardService.delete(id)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: 'Reward deleted'
                    }
                ]
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkDeleteRewards(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)

            ValidateIdArray(ids)

            const bulkDeleteResult = await this.rewardService.bulkDelete(ids)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => !bulkDeleteResult.errors,
                        status: status.OK,
                        message: 'Rewards deleted'
                    },
                    {
                        condition: () => !!bulkDeleteResult.errors && Object.keys(bulkDeleteResult.errors).length < ids.length,
                        status: status.PARTIAL_CONTENT,
                        message: 'Rewards deleted partilly'
                    },
                    {
                        condition: () => true,
                        status: status.BAD_REQUEST,
                        message: 'Rewards were not deleted. Too much invalid data'
                    }
                ],
                data: bulkDeleteResult
            })
        } catch (e) {
            SendError(res, e)
        }
    }
}