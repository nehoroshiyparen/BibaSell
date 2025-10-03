import z from "zod";

export const PersonSchema = z.object({
    name: z.string(),
    addition: z.string().optional(),
    description: z.string().optional(),
    rank: z.string().optional(),
    comments: z.string().optional(),
}).strict()
export type TypeofPersonSchema = z.infer<typeof PersonSchema>