import { ApiError } from "../ApiError/ApiError";

export function ValidateObjectFieldsNotNull(filters: object) {
    if (!Object.values(filters).some(val => val !== null && val !== undefined)) {
        throw ApiError.BadRequest(`There must be at least one filtered param`);
    }
}