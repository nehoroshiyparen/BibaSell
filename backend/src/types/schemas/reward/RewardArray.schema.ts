import z from "zod";
import { RewardSchema } from "./Reward.schema";

export const RewardArrayJsonSchema = z.object({
    data: z.array(RewardSchema)
})
export const RewardArraySchema = z.array(RewardSchema)
export type RewardArray = z.infer<typeof RewardArraySchema>