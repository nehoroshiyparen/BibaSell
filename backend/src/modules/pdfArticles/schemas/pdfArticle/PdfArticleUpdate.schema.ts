import z from "zod";
import { UpdateOptionsSchema } from "../options/UpdateOptionsSchema.js";

export const PdfArticleUpdateSchema = z.object({
    title: z.string().optional(),
    authors: z.array(z.string()).optional(),
    functions: UpdateOptionsSchema.optional(),
})
/**
 * @swagger
 * components:
 *   schemas:
 *     TypeofPdfArticleUpdateSchema:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         authors:
 *           type: string
 *         functions:
 *           type: object
 *           properties:
 *             removePreview:
 *               type: boolean
 */
export type TypeofPdfArticleUpdateSchema = z.infer<typeof PdfArticleUpdateSchema>