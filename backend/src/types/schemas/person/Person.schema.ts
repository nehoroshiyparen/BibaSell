import z from "zod";

export const PersonSchema = z.object({
    name: z.string(),
    surname: z.string(),
    patronymic: z.string(),
    addition: z.string().optional(),
    description: z.string().optional(),
    rank: z.string().optional(),
    comments: z.string().optional(),
})

export type Person = z.infer<typeof PersonSchema>