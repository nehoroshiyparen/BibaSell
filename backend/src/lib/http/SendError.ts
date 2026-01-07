import { Response } from "express";
import { ApiResponse } from "#src/types/interfaces/http/Response.interface.js";
import { ApiError } from "../../shared/ApiError/ApiError.js";
import { errorCodes } from "#src/consts/index.js";
import { status } from "#src/consts/status.js";
import { isError } from "../../shared/typeGuards/isError.js";
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
    } else {
        if (isError(e)) {
            console.log('Unknown error', e)
            console.log(e.stack);
        }
    }

    const response: ApiResponse<void> = {
        status: 400,
        message: responseMessage,
        error: {
            code: errorCode,
            message: errorMessage
        }
    }

    res.status(errorStatus).json(response)
}