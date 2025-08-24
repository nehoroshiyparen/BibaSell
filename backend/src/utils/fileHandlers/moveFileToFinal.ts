import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { ApiError } from '../ApiError/ApiError';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_BASE = path.join(__dirname, '../../../uploads')

export function moveFileToFinal(tempDirPath: string, title: string, dir: string) {
    const destDir = path.join(UPLOAD_BASE, 'final', dir)

    const pngPath = path.join(tempDirPath, `${title}.png`);
    const jpgPath = path.join(tempDirPath, `${title}.jpg`);
    const jpegPath = path.join(tempDirPath, `${title}.jpeg`);

    let sourceFile: string | null = null;

    if (fs.existsSync(pngPath)) {
        sourceFile = pngPath;
    } else if (fs.existsSync(jpgPath)) {
        sourceFile = jpgPath;
    } else if (fs.existsSync(jpegPath)) {
        sourceFile = jpegPath;
    }

    if (sourceFile) {
        const ext = path.extname(sourceFile)
        const filePath = path.join(destDir, `${title}${ext}`)
        fs.renameSync(sourceFile, filePath)

        return filePath
    }
}