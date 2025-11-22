import z from "zod";

export const PersonRewardsSchema = z.object({
    person_id: z.number(),
    rewards: z.array(
        z.object({
            label: z.string()
        })
    ),
})
export type TypeofPersonRewardsSchema = z.infer<typeof PersonRewardsSchema>