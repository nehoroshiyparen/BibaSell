import z from "zod";
import { RewardSchema } from "./Reward.schema.js";

export const RewardArrayJsonSchema = z.object({
    data: z.array(RewardSchema)
})
export const RewardArraySchema = z.array(RewardSchema)
export type TypeofRewardArraySchema = z.infer<typeof RewardArraySchema>