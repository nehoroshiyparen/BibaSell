import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_BASE = path.join(__dirname, '../../../../uploads')

export function createUniqueDir() {
    const foldername = crypto.randomUUID()
    const tempDir = path.join(UPLOAD_BASE, 'temp', foldername)

    fs.mkdirSync(tempDir, { recursive: true })
    return tempDir
}