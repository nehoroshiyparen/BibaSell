import { fromPath } from "pdf2pic";
import path from "path";

/**
 * Transforms first page of pdf-file to png
 * @param filepath to original pdf
 * @param saveTo path to distination folder
 * @param filename title for png image
 * @returns Returns full path to file and filename
 */
export async function pdf2pic(filepath: string, saveTo: string, filename: string): Promise<string> {
    const convert = fromPath(filepath, {
        density: 150,
        saveFilename: filename,
        savePath: saveTo,
        format: "png",
        width: 1024,
        height: 768,
    })
    const result = await convert(1)

    const fullPath = path.resolve(result.path!)

    return fullPath
}