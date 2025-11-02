import { ApiError } from "#src/shared/ApiError/ApiError.js"
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js"
import { readFile } from "./readFile.js"

export async function readFileFromConfig(
        fileConfig: FileConfig,
        key: keyof FileConfig["files"],
        required = true
    ): Promise<Buffer | undefined> {
    const file = fileConfig.files[key] as Express.Multer.File | undefined
    if (!file && required)
        throw ApiError.BadRequest(`Missing required file: ${String(key)}`)
    return file ? await readFile(file.path) : undefined
}