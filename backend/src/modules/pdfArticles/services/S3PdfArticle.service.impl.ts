import { TYPES } from "#src/di/types.js";
import { BaseS3Service } from "#src/infrastructure/S3/baseS3.service.js";
import { IS3 } from "#src/types/contracts/core/s3.interface.js";
import { inject, injectable } from "inversify";

@injectable()
export class S3PdfArticleServiceImpl extends BaseS3Service {
    protected prefix = "articles/"

    constructor(@inject(TYPES.S3) s3: IS3) {
        super(s3)
    }
}
