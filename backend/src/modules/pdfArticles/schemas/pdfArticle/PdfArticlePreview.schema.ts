import z from "zod";
import { AuthorSchema } from "../author/Author.schema.js";

export const PdfArticlePreviewSchema = z.object({
    id: z.number(),
    title: z.string(),
    preview: z.string(),
    publishedAt: z.date(),
    authors: z.array(AuthorSchema)
})
/**
 * @swagger
 * components:
 *   schemas:
 *     TypeofPdfAcrticlePreviewSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         preview:
 *           type: string
 *         publishedAt:
 *           type: string
 *           format: date
 *         authors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TypeofAuthorSchema'
 */
export type TypeofPdfAcrticlePreviewSchema = z.infer<typeof PdfArticlePreviewSchema>