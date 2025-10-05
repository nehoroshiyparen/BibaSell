import path from "path";
import { ApiError } from "../../ApiError/ApiError.js";

export function getRelativePath(filepath: string | null, folder: string) {
    if (filepath) return path.join(folder, path.basename(filepath))
    else throw ApiError.BadRequest(`Incorrect fileapth: ${filepath}`)
}