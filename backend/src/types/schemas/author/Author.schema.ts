import z from "zod";

export const AuthorSchema = z.object({
    id: z.number(),
    name: z.string(),
})
export type TypeofAuthorSchema = z.infer<typeof AuthorSchema>