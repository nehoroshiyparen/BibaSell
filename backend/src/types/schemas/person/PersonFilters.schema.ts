import z from "zod";

export const PersonFiltersSchema = z.object({
    name: z.string().optional(),
    rank: z.string().optional()
})
export type TypeofPersonFiltersSchema = z.infer<typeof PersonFiltersSchema>