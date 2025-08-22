import { Router } from "express";
import { inject, injectable } from "inversify";
import { RewardControllerImpl } from "#src/controllers/reward.controller.js";
import { TYPES } from "#src/di/types.js";

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
        this.router.get('/pagination', this.rewardController.getRewards.bind(this.rewardController))
        this.router.post('/filtered', this.rewardController.getFilteredRewards.bind(this.rewardController))
        this.router.get('/:id', this.rewardController.getRewardById.bind(this.rewardController))

        this.router.patch('/bulk', this.rewardController.bulkCreateRewards.bind(this.rewardController))
        
        this.router.delete('/bulk', this.rewardController.bulkDeleteRewards.bind(this.rewardController))
    }

    getRouter(): Router { return this.router }
}