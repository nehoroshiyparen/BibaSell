import z from 'zod'

export const MapUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    year: z.date().optional()
})
export type TypeofMapUpdateSchema = z.infer<typeof MapUpdateSchema>