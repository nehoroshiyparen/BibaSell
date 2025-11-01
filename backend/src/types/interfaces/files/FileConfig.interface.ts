export interface FileConfig {
    tempDirPath: string,
    files: Record<string, Express.Multer.File[] | Express.Multer.File>
} 