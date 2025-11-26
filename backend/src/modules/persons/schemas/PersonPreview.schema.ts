import z from "zod";

export const PersonPreviewShema = z.object({
    id: z.number(),
    key: z.string(),
    name: z.string(),
    description: z.string(),
})
/**
 * @swagger
 * components:
 *  schemas:
 *      TypeofPersonPreviewSchema:
 *          type: object
 *          properties:
 *              id: 
 *                  type: integer
 *              key:
 *                  type: string
 *              name:
 *                  type: string
 *              description:
 *                  type: string
 */
export type TypeofPersonPreviewSchema = z.infer<typeof PersonPreviewShema>