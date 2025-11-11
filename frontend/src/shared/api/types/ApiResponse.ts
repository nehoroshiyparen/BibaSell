import type { ApiError } from "./ApiError";

export interface ApiResponse<T> {
    status: number,
    message: string,
    data?: T,
    error?: ApiError
}