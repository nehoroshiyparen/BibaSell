import { createUniqueDir } from "#src/shared/files/create/createUniqueDir.js";
import { NextFunction, Request, Response } from "express";

export function prepareTempDir(req: Request, res: Response, next: NextFunction) {
  const tempDir = createUniqueDir(); 
  req.tempUploadDir = tempDir;
  next();
}