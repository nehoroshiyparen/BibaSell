import z from "zod";

export const PersonSchema = z.object({
    name: z.string(),
    addition: z.string().nullable(),
    description: z.string().nullable(),
    rank: z.string().nullable(),
    comments: z.string().nullable(),
    rewards: z.array(
        z.object({
            label: z.string()
        })
    )
}).strict()

/**
 * @swagger
 * components:
 *   schemas:
 *     PersonReward:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *       required:
 *         - label
 *     TypeofPersonSchema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         addition:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         rank:
 *           type: string
 *           nullable: true
 *         comments:
 *           type: string
 *           nullable: true
 *         rewards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PersonReward'
 *       required:
 *         - name
 */
export type TypeofPersonSchema = z.infer<typeof PersonSchema>