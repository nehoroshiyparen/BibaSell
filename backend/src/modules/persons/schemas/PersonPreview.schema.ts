import z from "zod";

export const PersonPreviewShema = z.object({
    id: z.number(),
    key: z.string(),
    name: z.string(),
    description: z.string(),
})
export type TypeofPersonPreviewSchema = z.infer<typeof PersonPreviewShema>