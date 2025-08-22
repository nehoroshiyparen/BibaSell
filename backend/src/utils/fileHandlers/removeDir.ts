import fs from 'fs'

export function removeDir(dirPath: string) {
    fs.rmSync(dirPath, { force: true })
}