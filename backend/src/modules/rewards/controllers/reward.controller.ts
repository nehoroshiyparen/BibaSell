import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "#src/di/types.js";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js";
import { RewardArraySchema } from "#src/modules/rewards/schemas/reward/RewardArray.schema.js";
import { SendError, SendResponse } from "#src/shared/http/index.js";
import { ValidateObjectFieldsNotNull } from "#src/shared/validations/objectFieldsNotNull.validate.js";
import { ValidateId } from "#src/shared/validations/ids/id.validate.js";
import { ValidateIdArray } from "#src/shared/validations/ids/idArray.validate.js";
import { ValidatePaginationParams } from "#src/shared/validations/paginationParams.validate.js";
import { RewardFiltersSchema } from "#src/modules/rewards/schemas/reward/RewardFilters.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";

@injectable()
export class RewardControllerImpl {
    constructor (
        @inject(TYPES.RewardService) private rewardService: IRewardService
    ) {}

    async getRewardById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            ValidateId(id)

            const reward = await this.rewardService.getRewardById(id)

            SendResponse(res, 200, `Reward fetched`, reward)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getRewardBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)

            const reward = await this.rewardService.getRewardBySlug(slug)

            SendResponse(res, 200, `Reward fetched`, reward)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getRewards(req: Request, res: Response) {
        try {
            const [offset, limit] = ['offset', 'limit'].map(k => Number(req.query[k]))

            ValidatePaginationParams(offset, limit)

            const rewards = await this.rewardService.getRewards(offset, limit)

            SendResponse(res, 200, `Rewards fetched`, rewards)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Этот обработчик будет для POST запроса, тк он служит для фильтрации данных
     * Чуть подробнее написал в методе getFilteredMDXArticle
     * @param req 
     * @param res 
     */
    async getFilteredRewards(req: Request, res: Response) {
        try {
            const filters = req.body

            const [offset, limit] = ['offset', 'limit'].map(k => Number(req.query[k]))

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = RewardFiltersSchema.parse(filters)

            const rewards = await this.rewardService.getFilteredRewards(validatedFilters, offset, limit)

            SendResponse(res, 200, rewards ? `Rewards fetched` : `No candidates found`, rewards)
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkCreateRewards(req: Request, res: Response) {
        try {
            const data = JSON.parse(req.body.data)
        
            const validatedData = RewardArraySchema.parse(data)

            const fileConfig: FileConfig | undefined = 
                req.tempUploadDir ? 
                    {
                        tempDirPath: req.tempUploadDir,
                        files: req.files as Express.Multer.File[] | undefined
                    } : undefined

            const { status } = await this.rewardService.bulkCreateRewards(validatedData, fileConfig)

            SendResponse(res, status, status === 201 ? `Rewards created` : status === 206 ? `Rewards created partilly` : `Rewards weren't created. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkDeleteRewards(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.rewardService.bulkDeleteRewards(ids)

            SendResponse(res, status, status === 200 ? `Rewards deleted` : status === 206 ? `Rewards deleted partilly` : `Rewards weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}