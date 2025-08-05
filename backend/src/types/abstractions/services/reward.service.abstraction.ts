import { Reward } from "src/database/models/Reward.model";
import { TypeofRewardSchema } from 'src/types/schemas/reward/Reward.schema'
import { RewardArray } from "src/types/schemas/reward/RewardArray.schema";

export interface RewardServiceAbstract {
    getRewardById(id: number): Promise<Reward>;
    getRewards(offset: number, limit: number): Promise<Reward[] | null>;
    getFilteredRewards(filters: TypeofRewardSchema): Promise<Reward[] | null>
    uploadRewardPack(data: RewardArray): Promise<{ status: number }>;
    deleteRewards(ids: number[]): Promise<{ status: number }>;
}