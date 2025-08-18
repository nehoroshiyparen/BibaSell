import z from "zod";
import { ArticleSchema } from "./Article.schema.js";
import { HeadingArraySchema } from "../heading/HeadingArray.schema.js";

export const ArticlePatchSchema = ArticleSchema.extend({
    headings: HeadingArraySchema.optional()
}).strict()
export type TypeofAdvancedArticleSchema = z.infer<typeof ArticlePatchSchema>