import z from "zod";

export const RewardUploadSingleSchema = z.object({
    label: z.string(),
    releaseDate: z.string(),
    count: z.string(),
    addition: z.string().nullable(),
    description: z.string().nullable(),
    image_path: z.string().nullable(),
})
export type TypeofRewardUploadSingleSchemaSchema = z.infer<typeof RewardUploadSingleSchema>