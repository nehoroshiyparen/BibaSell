import z from "zod";

export const PersonFiltersSchema = z.object({
    name: z.string().optional(),
    surname: z.string().optional,
    patronymic: z.string().optional(),
    rank: z.string().optional()
})
export type TypeofPersonFiltersSchema = z.infer<typeof PersonFiltersSchema>