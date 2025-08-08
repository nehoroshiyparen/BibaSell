import z from "zod";
import { ArticleSchema } from "./Article.schema";
import { HeadingArraySchema } from "../heading/HeadingArray.schema";

export const ArticlePatchSchema = ArticleSchema.extend({
    headings: HeadingArraySchema
})
export type TypeofArticlePatchSchema = z.infer<typeof ArticlePatchSchema>