import z from "zod";

export const RewardSchema = z.object({
    label: z.string(),
    realeseDate: z.string(),
    count: z.number(),
    addition: z.string(),
    description: z.string(),
})
export type TypeofRewardSchema = z.infer<typeof RewardSchema>