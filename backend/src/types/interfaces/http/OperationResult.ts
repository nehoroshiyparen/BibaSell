import { Error } from "./Error.interface.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     BulkCreatePersonsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 created:
 *                   type: integer
 *               example:
 *                 success: true
 *                 created: 1
 */
export interface OperationResult<TError = any> {
    success: boolean,
    errors?: Record<string | number, TError>,
    [key: string]: any
}