import z from "zod";

export const RewardPreviewSchema = z.object({
    id: z.number(),
    slug: z.string(),
    key: z.string(),
    label: z.string(),
})
export type TypeofRewardPreviewSchema = z.infer<typeof RewardPreviewSchema>