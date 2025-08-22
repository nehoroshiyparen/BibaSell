import { Reward } from "#src/database/models/Reward.model.js";
import { RewardArray } from "#src/types/schemas/reward/RewardArray.schema.js";
import { TypeofRewardFiltersSchema } from "#src/types/schemas/reward/RewardFilters.schema.js";

export interface RewardServiceAbstract {
    getRewardById(id: number): Promise<Reward>;
    getRewards(offset: number, limit: number): Promise<Reward[] | null>;
    getFilteredRewards(filters: TypeofRewardFiltersSchema): Promise<Reward[] | null>
    bulkCreateRewards(data: RewardArray): Promise<{ status: number }>;
    bulkDeleteRewards(ids: number[]): Promise<{ status: number }>;
}