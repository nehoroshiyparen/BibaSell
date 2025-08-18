import { ApiError } from "../ApiError/ApiError.js";

export function ValidateObjectFieldsNotNull(filters: object) {
    console.log(filters)
    if (!Object.values(filters).some(val => val != null && val !== '')) {
        throw ApiError.BadRequest(`There must be at least one filtered param`);
    }

    return true
}