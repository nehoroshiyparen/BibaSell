import z from 'zod'

export const MapFiltersSchema = z.object({
    title: z.string(),
    description: z.string(),
    year: z.date()
})
export type TypeofMapFiltersSchema = z.infer<typeof MapFiltersSchema>