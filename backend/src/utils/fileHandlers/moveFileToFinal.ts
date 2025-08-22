import fs from 'fs'
import path from 'path'
import { getSlug } from '../slugging/getSlug.js'
import { ENV } from '#src/config/index.js'

export function moveFileToFinal(tempDirPath: string, title: string, dir: string) {
    const slug = getSlug(title)

    if (fs.existsSync(path.join(tempDirPath, `${slug}.jpg`))) {
        fs.renameSync(path.join(tempDirPath, `${slug}.jpg`), path.join(ENV.MULTER_UPLOAD_PATH, dir, `${slug}.jpg`))
    }
}