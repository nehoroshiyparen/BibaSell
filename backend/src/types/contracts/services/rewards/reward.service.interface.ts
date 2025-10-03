import { Reward } from "#src/infrastructure/sequelize/models/Reward/Reward.model.js"; 
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { RewardArray } from "#src/modules/rewards/schemas/reward/RewardArray.schema.js";
import { TypeofRewardFiltersSchema } from "#src/modules/rewards/schemas/reward/RewardFilters.schema.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";

export interface IRewardService {
    getRewardById(id: number): Promise<Reward>;
    getRewardBySlug(slug: string): Promise<Reward>
    getRewards(offset: number, limit: number): Promise<Reward[] | null>;
    getFilteredRewards(filters: TypeofRewardFiltersSchema, offset?: number, limit?: number): Promise<Reward[] | null>
    bulkCreateRewards(data: RewardArray, fileConfig: FileConfig | undefined): Promise<OperationResult>;
    deleteReward(id: number): Promise<void>
    bulkDeleteRewards(ids: number[]): Promise<OperationResult>;
}