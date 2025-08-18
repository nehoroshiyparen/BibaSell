import { errorCodes } from "#src/consts/errorCodes.js"
import { status } from "#src/consts/status.js"

export class ApiError extends Error {
    status: number
    code?: string
    cause?: unknown

    constructor (
        status: number,
        message: string,
        code?: string,
        cause?: unknown
    ) {
        super(message)
        this.status = status
        this.code = code
        this.cause = cause

        Object.setPrototypeOf(this, ApiError.prototype)
    }

    static BadRequest(message = 'Bad Request', code?: string, cause?: unknown) {
        return new ApiError(status.BAD_REQUEST, message, code ? code : errorCodes.BAD_REQUEST, cause)
    }

    static Forbidden(message = 'Forbidden', code?: string, cause?: unknown) {
        return new ApiError(status.FORBIDDEN, message, code ? code : errorCodes.FORBIDDEN, cause)
    }

    static NotFound(message = 'Not Found', code?: string, cause?: unknown) {
        return new ApiError(status.NOT_FOUND, message, code ? code : errorCodes.NOT_FOUND, cause)
    }

    static Conflict(message = 'Conflict', code?: string, cause?: unknown) {
        return new ApiError(status.CONFLICT, message, code ? code : errorCodes.CONFLICT, cause)
    }

    static Internal(message = 'Internal error', code?: string, cause?: unknown) {
        return new ApiError(status.INTERNAL_SERVER_ERROR, message, code ? code : errorCodes.INTERNAL_SERVER_ERROR, cause)
    }
}