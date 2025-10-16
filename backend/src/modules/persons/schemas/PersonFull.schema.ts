import z from "zod";

export const PersonFullSchema = z.object({
    id: z.number(),
    key: z.string(),
    name: z.string(),
    addtition: z.string(),
    description: z.string(),
    rank: z.string(),
    comments: z.string(),
})
export type TypeofPersonFullSchema = z.infer<typeof PersonFullSchema>