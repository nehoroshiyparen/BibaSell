import multer from 'multer'
import fs from 'fs'
import { ENV } from '#src/config/index.js'
import { createUniqueDir } from '#src/utils/fileHandlers/createUniqueDir.js'
import { MulterRequest } from '#src/types/extensions/MulterRequest.js'

if (!fs.existsSync(ENV.MULTER_GAP_DIR_PATH)) {
    throw Error(`${ENV.MULTER_GAP_DIR_PATH} does not exists`)
}

export const diskStorage = multer.diskStorage({
    destination: (req: MulterRequest, _file, cb) => {
        const tempDir = createUniqueDir()
        req.tempUploadDir = tempDir
        cb(null, ENV.MULTER_GAP_DIR_PATH);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const memoryStorage = multer.memoryStorage()
export const upload = multer({ storage: diskStorage })