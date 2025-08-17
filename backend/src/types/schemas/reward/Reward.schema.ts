import z from "zod";

export const RewardSchema = z.object({
    label: z.string(),
    realeseDate: z.string(),
    count: z.number(),
    addition: z.string().optional(),
    description: z.string().optional(),
}).strict()
export type TypeofRewardSchema = z.infer<typeof RewardSchema>