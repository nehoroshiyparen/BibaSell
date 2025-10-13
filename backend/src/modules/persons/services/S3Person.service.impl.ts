import { TYPES } from "#src/di/types.js";
import { BaseS3Service } from "#src/infrastructure/S3/baseS3.service.js";
import { IBaseS3Repo } from "#src/types/contracts/core/base.s3-repo.interface.js";
import { inject, injectable } from "inversify";

@injectable()
export class S3PersonServiceImpl extends BaseS3Service {
    protected prefix = "persons/"

    constructor(@inject(TYPES.S3) s3: IBaseS3Repo) {
        super(s3)
    }
}