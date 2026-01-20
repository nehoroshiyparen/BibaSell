import z from "zod";

export const MapPreviewSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  year: z.number(),
  key: z.string(),
});
export type TypeofMapPreviewSchema = z.infer<typeof MapPreviewSchema>;
