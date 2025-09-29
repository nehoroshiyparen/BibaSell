import { ApiError } from "#src/shared/ApiError/ApiError.js"

export function ValidateIdArray(ids: number[]) {
    if (!ids.length) throw ApiError.BadRequest('No id provided for deletion')
    if (ids.some(id => isNaN(id) || id < 1)) throw ApiError.BadRequest('All id must be positive numbers')
}