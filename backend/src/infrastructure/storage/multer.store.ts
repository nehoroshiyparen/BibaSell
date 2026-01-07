import multer from 'multer'
import path from 'path'

export const diskStorage = multer.diskStorage({
    destination: (req, _file, cb) => {
        if (!req.tempUploadDir) {
            return cb(new Error('Temporary upload directory not set'), '');
        }
        cb(null, req.tempUploadDir);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const memoryStorage = multer.memoryStorage()
export const upload = multer({ storage: diskStorage })