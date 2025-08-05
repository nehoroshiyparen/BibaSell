import { Router } from "express";
import { inject, injectable } from "inversify";
import { RewardControllerImpl } from "src/controllers/reward.controller";
import { TYPES } from "src/di/types";

@injectable()
export class RewardRouter {
    private router: Router

    constructor(
        @inject(TYPES.RewardController) private personController: RewardControllerImpl
    ) {
        this.router = Router()
        this.setup()
    }

    async setup() {
        this.router.get('/:id', this.personController.getRewardById)
        this.router.get('/pagination', this.personController.getRewards)
        this.router.get('/filtered', this.personController.getFilteredRewards)
        this.router.patch('/pack', this.personController.uploadRewardPack)
        this.router.delete('/pack', this.personController.deleteRewards)
    }

    getRouter(): Router { return this.router }
}