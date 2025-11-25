import z from "zod";

export const PersonUploadSingleSchema = z.object({
    name: z.string(),
    addition: z.string().nullable(),
    description: z.string().nullable(),
    rank: z.string().nullable(),
    comments: z.string().nullable(),
    image_path: z.string().nullable(),
    rewards: z.array(
        z.object({
            label: z.string()
        })
    )
})
export type TypeofPersonUploadSingleSchema = z.infer<typeof PersonUploadSingleSchema>