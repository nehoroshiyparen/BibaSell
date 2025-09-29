import { ApiError } from "../ApiError/ApiError.js";

export function ValidatePaginationParams(offset: number, limit: number) {
    if (offset < 0 || limit < 0) throw ApiError.BadRequest('Offset and limit must be positive numbers')
}