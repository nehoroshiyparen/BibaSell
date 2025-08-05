import z from "zod";
import { RewardSchema } from "./Reward.schema";

export const RewardArraySchema = z.array(RewardSchema)
export type RewardArray = z.infer<typeof RewardArraySchema>