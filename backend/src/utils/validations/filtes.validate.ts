import { ApiError } from "../ApiError/ApiError";

export function ValidateFilters(filters: object) {
    if (Object.values(filters).every(val => !val))  throw ApiError.BadRequest(`There must be at least one filtered param`)
}