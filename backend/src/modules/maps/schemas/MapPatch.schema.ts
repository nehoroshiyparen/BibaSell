import z from "zod";

export const MapPatchSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.number(),
});
export type TypeofMapPatchSchema = z.infer<typeof MapPatchSchema>;
