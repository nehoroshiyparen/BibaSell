import z from "zod";

export const AuthorSchema = z.object({
    id: z.number(),
    name: z.string(),
})
/**
 * @swagger
 * components:
 *   schemas:
 *     TypeofAuthorSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */
export type TypeofAuthorSchema = z.infer<typeof AuthorSchema>