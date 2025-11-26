import z from "zod";

export const RewardPreviewSchema = z.object({
    id: z.number(),
    slug: z.string(),
    key: z.string(),
    label: z.string(),
})
/**
 * @swagger
 * components:
 *   schemas:
 *     TypeofRewardPreviewSchema:
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
 */
export type TypeofRewardPreviewSchema = z.infer<typeof RewardPreviewSchema>