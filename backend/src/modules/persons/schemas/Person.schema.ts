import z from "zod";

export const PersonSchema = z.object({
    name: z.string(),
    addition: z.string().nullable(),
    description: z.string().nullable(),
    rank: z.string().nullable(),
    comments: z.string().nullable(),
    rewards: z.array(
        z.object({
            label: z.string()
        })
    ).nullable()
}).strict()
export type TypeofPersonSchema = z.infer<typeof PersonSchema>