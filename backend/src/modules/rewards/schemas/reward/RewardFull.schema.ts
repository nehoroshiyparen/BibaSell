import z from "zod";

export const RewardFullSchema = z.object({
    id: z.number(),
    slug: z.string(),
    key: z.string(),
    label: z.string(),
    releaseDate: z.string(),
    count: z.number(),
    addition: z.string(),
    description: z.string(),
})
export type TypeofRewardFullSchema = z.infer<typeof RewardFullSchema>