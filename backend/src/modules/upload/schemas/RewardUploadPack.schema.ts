import z from "zod";
import { RewardUploadSingleSchema } from "./RewardUploadSingle.schema.js";

export const RewardUploadPackSchema = z.array(RewardUploadSingleSchema)
export type TypeofRewardUploadPackSchema = z.infer<typeof RewardUploadPackSchema>