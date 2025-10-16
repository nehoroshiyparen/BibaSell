import { TYPES } from "#src/di/types.js";
import { inject, injectable } from "inversify";
import { S3RewardServiceImpl } from "../services/S3Reward.service.impl.js";
import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js";
import { TypeofRewardFullSchema } from "../schemas/reward/RewardFull.schema.js";
import { TypeofRewardPreviewSchema } from "../schemas/reward/RewardPreview.schema.js";

@injectable()
export class RewardMapper {
    constructor(
        @inject(TYPES.S3RewardService) private s3: S3RewardServiceImpl
    ) {}

    async toFull(reward: Reward): Promise<TypeofRewardFullSchema> {
        const urls = await this.s3.getSignedUrls([reward.key])
        return { ...reward.toJSON(), key: urls[reward.key] }
    }

    async toPreview(rewards: Reward[]): Promise<TypeofRewardPreviewSchema[]> {
        const json = rewards.map(reward => reward.toJSON())
        const modifiedPersons = await Promise.all(json.map(async reward => {
            const urls = await this.s3.getSignedUrls([reward.key])
            return {
                id: reward.id,
                slug: reward.slug,
                key: urls[reward.key],
                label: reward.label,
            }
        }))
        return modifiedPersons
    }
}