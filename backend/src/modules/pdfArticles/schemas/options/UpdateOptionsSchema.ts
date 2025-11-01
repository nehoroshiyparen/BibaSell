import z from "zod";

export const UpdateOptionsSchema = z.object({
    removePreview: z.boolean().optional(),
})
export type TypeofUpdateOptionsSchema = z.infer<typeof UpdateOptionsSchema>