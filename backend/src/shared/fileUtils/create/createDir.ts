import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const UPLOAD_BASE = path.join(__dirname, '../../../../uploads')

export function createDir(dirname: string) {
    const dirPath = path.join(UPLOAD_BASE, 'final/mdxArticles', dirname)
    console.log(dirPath)
    fs.mkdirSync(dirPath, { recursive: true })
    return dirPath
}