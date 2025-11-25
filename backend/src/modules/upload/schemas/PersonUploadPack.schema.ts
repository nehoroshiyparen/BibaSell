import z from "zod";
import { PersonUploadSingleSchema } from "./PersonUploadSingle.schema.js";

export const PersonUploadPackSchema = z.array(PersonUploadSingleSchema)
export type TypeofPersonUploadPackSchema = z.infer<typeof PersonUploadPackSchema>