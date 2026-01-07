import { errorCodes } from "#src/consts/index.js";
import { ApiError } from "./ApiError.js";

export function RethrowApiError(message: string, error: unknown): never {
    if (error instanceof ApiError) throw error
    throw ApiError.Internal(message, errorCodes.INTERNAL_SERVER_ERROR, error)
}