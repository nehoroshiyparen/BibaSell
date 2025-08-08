import { ApiError } from "../../ApiError/ApiError";

export function ValidateId(id: number) {
    if (isNaN(id) || id < 1) throw ApiError.BadRequest('Invalid person id')
}