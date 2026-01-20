import z from "zod";

export const MapFiltersSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.number(),
});
export type TypeofMapFiltersSchema = z.infer<typeof MapFiltersSchema>;
