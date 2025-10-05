import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_BASE = path.join(__dirname, '../../../../uploads')

export function removeFile(filename: string, dir: string, targetFile?: string) {
    const key = targetFile ? targetFile : path.join(UPLOAD_BASE, dir, filename)

    if (fs.existsSync(key)) {
        fs.unlinkSync(key); 
    }
}