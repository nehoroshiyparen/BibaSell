import { Response } from "express";
import { ApiResponse } from "src/types/interfaces/http/Response.interface";
import { ApiError } from "../ApiError/ApiError";
import { errorCodes } from "src/consts/errorCodes";
import { status } from "src/consts/status";
import { isError } from "../typeGuards/isError";

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
        responseMessage = 'Predicted error'
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