import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_BASE = path.join(__dirname, '../../../uploads')

export function moveFileToFinal(tempDirPath: string, filename: string, relativeDir: string, newFilename?: string) {
    const destDir = path.join(UPLOAD_BASE, 'final', relativeDir)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

    let sourceFile: string | null = null

    const ext = path.extname(filename)
    if (ext) {
        const basePath = path.join(tempDirPath, filename)
        if (fs.existsSync(basePath)) sourceFile = basePath
    } else {
        for (const e of ['.png', '.jpg', '.jpeg']) {
            const p = path.join(tempDirPath, filename + e)
            if (fs.existsSync(p)) {
                sourceFile = p
                break
            }
        }
    }

    if (!sourceFile) {
        console.warn(`File not found: ${filename}`)
        return 
    }

    const finalName = (newFilename || path.basename(filename, ext)) + path.extname(sourceFile)
    const filepath = path.join(destDir, finalName)
    fs.renameSync(sourceFile, filepath)

    return filepath
}
