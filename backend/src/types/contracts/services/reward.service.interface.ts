import { TypeofRewardSchema } from "#src/modules/rewards/schemas/reward/Reward.schema.js";
import { TypeofRewardFiltersSchema } from "#src/modules/rewards/schemas/reward/RewardFilters.schema.js";
import { TypeofRewardFullSchema } from "#src/modules/rewards/schemas/reward/RewardFull.schema.js";
import { TypeofRewardPreviewSchema } from "#src/modules/rewards/schemas/reward/RewardPreview.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { IBaseService } from "./module.service.interface.js";

export interface IRewardService 
    extends IBaseService<
        TypeofRewardFullSchema,
        TypeofRewardPreviewSchema,
        TypeofRewardFiltersSchema,
        TypeofRewardSchema,
        unknown
    > {
        bulkCreate(data: TypeofRewardSchema[], fileConfig: FileConfig): Promise<OperationResult>
    }