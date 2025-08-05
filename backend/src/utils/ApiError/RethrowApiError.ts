import { errorCodes } from "src/consts/errorCodes";
import { ApiError } from "./ApiError";

export function RethrowApiError(message: string, error: unknown): never {
    if (error instanceof ApiError) throw error
    throw ApiError.Internal(message, errorCodes.INTERNAL_SERVER_ERROR, error)
}