import { createUniqueDir } from "#src/utils/fileHandlers/create/createUniqueDir.js";
import { NextFunction, Request, Response } from "express";

export function prepareTempDir(req: Request, res: Response, next: NextFunction) {
  const tempDir = createUniqueDir(); 
  req.tempUploadDir = tempDir;
  next();
}