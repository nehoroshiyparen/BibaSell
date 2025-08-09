import z from "zod";

export const RewardFiltersSchema = z.object({
    label: z.string().optional,
    realeseDate: z.string().optional,
    count: z.number().optional,
    addition: z.string().optional(),
    description: z.string().optional(),
})
export type TypeofRewardFiltersSchema = z.infer<typeof RewardFiltersSchema>