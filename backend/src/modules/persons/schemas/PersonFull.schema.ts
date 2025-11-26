import z from "zod";

export const PersonFullSchema = z.object({
    id: z.number(),
    key: z.string(),
    name: z.string(),
    addtition: z.string(),
    description: z.string(),
    rank: z.string(),
    comments: z.string(),
    rewards: z.array(
        z.object({
            key: z.string(),
            label: z.string()
        })
    )
})
/**
 * @swagger
 * components:
 *  schemas:
 *      TypeofPersonFullSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name: 
 *                  type: string
 *              addition: 
 *                  type: string
 *              description: 
 *                  type: string
 *              rank:
 *                  type: string
 *              comments: 
 *                  type: string
 *              rewards:  
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          key: 
 *                              type: string
 *                          label: 
 *                              type: string
 */
export type TypeofPersonFullSchema = z.infer<typeof PersonFullSchema>