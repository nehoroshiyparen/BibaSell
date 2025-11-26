import z from "zod";

export const RewardFullSchema = z.object({
    id: z.number(),
    slug: z.string(),
    key: z.string(),
    label: z.string(),
    releaseDate: z.string(),
    count: z.number(),
    addition: z.string(),
    description: z.string(),
})
/**
 * @swagger
 * components:
 *   schemas:
 *     TypeofRewardFullSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         slug:
 *           type: string
 *         key:
 *           type: string
 *         label:
 *           type: string
 *         releaseDate:
 *           type: string
 *         count:
 *           type: integer
 *         addition:
 *           type: string
 *         description:
 *           type: string
 */
export type TypeofRewardFullSchema = z.infer<typeof RewardFullSchema>