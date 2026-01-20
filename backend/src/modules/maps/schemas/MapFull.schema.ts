import z from "zod";

export const MapFullSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  year: z.number(),
  key: z.string(),
});
export type TypeofMapFullSchema = z.infer<typeof MapFullSchema>;
