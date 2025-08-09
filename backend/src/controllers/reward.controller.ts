import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "src/di/types";
import { RewardServiceAbstract } from "src/types/abstractions/services/reward.service.abstraction";
import { RewardSchema, TypeofRewardSchema } from "src/types/schemas/reward/Reward.schema";
import { RewardArraySchema } from "src/types/schemas/reward/RewardArray.schema";
import { SendError, SendResponse } from "src/utils/http";
import { ValidateObjectFieldsNotNull } from "src/utils/validations/objectFieldsNotNull.validate";
import { ValidateId } from "src/utils/validations/ids/id.validate";
import { ValidateIdArray } from "src/utils/validations/ids/idArray.validate";
import { ValidatePaginationParams } from "src/utils/validations/paginationParams.validate";
import { RewardFiltersSchema } from "src/types/schemas/reward/RewardFilters.schema";

@injectable()
export class RewardControllerImpl {
    constructor (
        @inject(TYPES.RewardService) private rewardService: RewardServiceAbstract
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

    async getRewards(req: Request, res: Response) {
        try {
            const offset = Number(req.query.offset)
            const limit = Number(req.query.limit)

            ValidatePaginationParams(offset, limit)

            const rewards = await this.rewardService.getRewards(offset, limit)

            SendResponse(res, 200, `Rewards fetched`, rewards)
        } catch (e) {
            SendError(res, e)
        }
    }

    /**
     * Этот обработчик будет для POST запроса, тк он служит для фильтрации данных
     * Чуть подробнее написал в методе getFilteredArticle
     * @param req 
     * @param res 
     */
    async getFilteredRewards(req: Request, res: Response) {
        try {
            const filters = req.body

            ValidateObjectFieldsNotNull(filters)
            const validatedFilters = RewardFiltersSchema.parse(filters)

            const rewards = await this.rewardService.getFilteredRewards(validatedFilters)

            SendResponse(res, 200, rewards ? `Rewards fetched` : `No candidates found`, rewards)
        } catch (e) {
            SendError(res, e)
        }
    }

    async uploadRewardPack(req: Request, res: Response) {
        try {
            const data = req.body
            
            const validatedData = RewardArraySchema.parse(data)

            const { status } = await this.rewardService.uploadRewardPack(validatedData)

            SendResponse(res, status, status === 201 ? `Rewards created` : status === 206 ? `Rewards created partilly` : `Rewards weren't created. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }

    async deleteRewards(req: Request, res: Response) {
        try {
            const ids = String(req.query).split(',').map(Number)

            ValidateIdArray(ids)

            const { status } = await this.rewardService.deleteRewards(ids)

            SendResponse(res, status, status === 200 ? `Rewards deleted` : status === 206 ? `Rewards deleted partilly` : `Rewards weren't deleted. To much invalid data`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}