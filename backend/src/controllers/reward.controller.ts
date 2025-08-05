import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "src/di/types";
import { RewardServiceAbstract } from "src/services/abstraction/reward.service.abstraction";
import { TypeofRewardSchema } from "src/types/schemas/reward/Reward.schema";
import { RewardArraySchema } from "src/types/schemas/reward/RewardArray.schema";
import { SendError, SendResponse } from "src/utils/http";

@injectable()
export class RewardControllerImpl {
    constructor (
        @inject(TYPES.RewardService) private rewardService: RewardServiceAbstract
    ) {}

    async getRewardById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

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

            const rewards = await this.rewardService.getRewards(offset, limit)

            SendResponse(res, 200, `Rewards fetched`, rewards)
        } catch (e) {
            SendError(res, e)
        }
    }

    async getFilteredRewards(req: Request, res: Response) {
        try {
            const filters: TypeofRewardSchema = {
                label: String(req.query.label),
                realeseDate: String(req.query.realeseDate),
                count: Number(req.query.count),
                addition: String(req.query.addition),
                description: String(req.query.description)
            }

            const rewards = await this.rewardService.getFilteredRewards(filters)

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

            SendResponse(res, status, status === 200 ? `Reward data pack uploaded` : `Reward data pack uploaded partially`, null)
        } catch (e) {
            SendError(res, e)
        }
    }

    async deleteRewards(req: Request, res: Response) {
        try {
            const ids = String(req.query).split(',').map(Number)

            const { status } = await this.rewardService.deleteRewards(ids)

            SendResponse(res, status, status === 200 ? `Rewards deleted` : `Rewards deleted partilly`, null)
        } catch (e) {
            SendError(res, e)
        }
    }
}