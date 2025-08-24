import fs from 'fs'

export function removeDir(dirPath: string) {
    fs.rmSync(dirPath, { recursive: true, force: true });
}