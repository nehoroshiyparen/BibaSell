import z from "zod";

export const PersonSchema = z.object({
    name: z.string(),
    surname: z.string(),
    patronymic: z.string(),
    addition: z.string(),
    description: z.string(),
    rank: z.string(),
    comments: z.string(),
})

export type Person = z.infer<typeof PersonSchema>