import z from "zod";

export const RewardSchema = z.object({
    label: z.string(),
    releaseDate: z.string(),
    count: z.number(),
    addition: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
}).strict()
export type TypeofRewardSchema = z.infer<typeof RewardSchema>