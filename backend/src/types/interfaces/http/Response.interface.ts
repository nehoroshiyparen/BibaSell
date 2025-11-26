import { Error } from "./Error.interface.js";

/**
 * @swagger
 * components:
 *  schemas:
 *      BaseResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: integer
 *                  example: 200
 *              message:
 *                  type: string
 *                  example: "OK"
 *              data: 
 *                  type: any
 *                  nullable: true
 *          required:
 *              - status
 *              - message
 */
export interface ApiResponse<T> {
    message: string,
    status: number,
    data?: T,
    error?: Error
}