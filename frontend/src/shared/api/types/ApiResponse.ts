import type { ApiError } from "./ApiError";

export interface ApiResponse<T> {
    message: string,
    data?: T,
    error?: ApiError
}