import { Router } from "express";
import { inject, injectable } from "inversify";
import { RewardControllerImpl } from "src/controllers/reward.controller";
import { TYPES } from "src/di/types";

@injectable()
export class RewardRouter {
    private router: Router

    constructor(
        @inject(TYPES.RewardController) private rewardController: RewardControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    async setup() {
        this.router.get('/:id', this.rewardController.getRewardById.bind(this.rewardController))
        this.router.get('/pagination', this.rewardController.getRewards.bind(this.rewardController))
        this.router.get('/filtered', this.rewardController.getFilteredRewards.bind(this.rewardController))
        this.router.patch('/pack', this.rewardController.uploadRewardPack.bind(this.rewardController))
        this.router.delete('/pack', this.rewardController.deleteRewards.bind(this.rewardController))
    }

    getRouter(): Router { return this.router }
}