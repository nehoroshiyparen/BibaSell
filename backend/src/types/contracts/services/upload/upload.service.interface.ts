import { TypeofPersonUploadPackSchema } from "#src/modules/upload/schemas/PersonUploadPack.schema.js"
import { TypeofRewardUploadPackSchema } from "#src/modules/upload/schemas/RewardUploadPack.schema.js"
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js"

export interface IUploadService {
    uploadRewardsPack({ data }: { data: TypeofRewardUploadPackSchema, tempDirPath: string }): Promise<OperationResult>
    uploadPersonPack({ data }: { data: TypeofPersonUploadPackSchema, tempDirPath: string }): Promise<OperationResult>
}