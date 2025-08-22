import "express-serve-static-core"
import 'express'
import 'multer'

declare module "express-serve-static-core" {
  interface Request {
    tempUploadDir?: string;
    files?: Express.Multer.File[];
  }
}