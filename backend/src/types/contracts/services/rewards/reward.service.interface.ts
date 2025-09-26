import { Reward } from "#src/database/models/Reward/Reward.model.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { RewardArray } from "#src/types/schemas/reward/RewardArray.schema.js";
import { TypeofRewardFiltersSchema } from "#src/types/schemas/reward/RewardFilters.schema.js";

export interface IRewardService {
    getRewardById(id: number): Promise<Reward>;
    getRewardBySlug(slug: string): Promise<Reward>
    getRewards(offset: number, limit: number): Promise<Reward[] | null>;
    getFilteredRewards(filters: TypeofRewardFiltersSchema, offset?: number, limit?: number): Promise<Reward[] | null>
    bulkCreateRewards(data: RewardArray, fileConfig: FileConfig | undefined): Promise<{ status: number }>;
    bulkDeleteRewards(ids: number[]): Promise<{ status: number }>;
}