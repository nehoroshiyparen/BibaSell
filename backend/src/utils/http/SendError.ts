import { Response } from "express";
import { ApiResponse } from "#src/types/interfaces/http/Response.interface.js";
import { ApiError } from "../ApiError/ApiError.js";
import { errorCodes } from "#src/consts/errorCodes.js";
import { status } from "#src/consts/status.js";
import { isError } from "../typeGuards/isError.js";
import { ZodError } from "zod";

export function SendError(
    res: Response,
    e: unknown
) {
    let errorStatus = status.INTERNAL_SERVER_ERROR
    let errorCode = errorCodes.INTERNAL_SERVER_ERROR
    let errorMessage = 'Service side error'
    let responseMessage = 'Unexpected error'


    if (e instanceof ApiError) {
        console.log(`API ERROR ${e.code || null} - ${e.message}`, e.cause)

        errorStatus = e.status
        errorCode = e.code ? e.code : ''
        errorMessage = e.message
        responseMessage = 'Request processing error'
    } else if (e instanceof ZodError) {
        errorStatus = status.BAD_REQUEST
        errorCode = 'ZOD_VALIDATION_ERROR'
        errorMessage = e.issues[0].message
        responseMessage = 'Validation error'
        
        console.log(errorMessage)
    } else {
        if (isError(e)) {
            console.log('Unknown error', e)
        }
    }

    const response: ApiResponse<void> = {
        message: responseMessage,
        error: {
            code: errorCode,
            message: errorMessage
        }
    }

    res.status(errorStatus).json(response)
}