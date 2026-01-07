import { IUploadService } from "#src/types/contracts/services/upload.service.interface.js";
import { inject, injectable } from "inversify";
import { TypeofRewardUploadPackSchema } from "../schemas/RewardUploadPack.schema.js";
import { TYPES } from "#src/di/types.js";
import { IRewardService } from "#src/types/contracts/services/rewards/reward.service.interface.js";
import { IPersonService } from "#src/types/contracts/services/persons/person.service.interface.js";
import path from "path";
import fs from 'fs'
import fse from "fs-extra";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { fileURLToPath } from "url";
import { RethrowApiError } from "#src/shared/ApiError/RethrowApiError.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";
import { TypeofPersonUploadPackSchema } from "../schemas/PersonUploadPack.schema.js";

@injectable()
export class UploadServiceImpl implements IUploadService {
    private __filename: string
    private __dirname: string

    constructor(
        @inject(TYPES.RewardService) private rewardService: IRewardService,
        @inject(TYPES.PersonService) private personService: IPersonService,
    ) {
        this.__filename = fileURLToPath(import.meta.url)
        this.__dirname = path.dirname(this.__filename)
    }

    async uploadRewardsPack({
        data,
        tempDirPath
    }: {
        data: TypeofRewardUploadPackSchema,
        tempDirPath: string
    }): Promise<OperationResult> {
        const labels = data.map(r => r.label);

        const folderPath = path.resolve(this.__dirname, '../../../data/rewards/images');
        const allFiles = fs.readdirSync(folderPath);
        const filesRecord: Record<string, Express.Multer.File> = {};

        for (const filename of allFiles) {
            const base = path.parse(filename).name;

            if (labels.includes(base)) {
                const srcPath = path.join(folderPath, filename);
                const destPath = path.join(tempDirPath, filename);

                await fse.copy(srcPath, destPath);

                const fileObj = {
                    fieldname: "images",
                    originalname: filename,
                    encoding: "7bit",
                    mimetype: "image/*",
                    buffer: fs.readFileSync(destPath),
                    size: fs.statSync(destPath).size,
                    destination: tempDirPath,
                    filename,
                    path: destPath,
                    stream: fs.createReadStream(destPath)
                } as Express.Multer.File;

                filesRecord[fileObj.originalname] = fileObj;
            }
        }

        const fileConfig: FileConfig = {
            tempDirPath,
            files: {
                images: Object.values(filesRecord),
            }
        };

        const dataToCreate = data.map(r => ({
            label: r.label,
            releaseDate: r.releaseDate,
            count: Number(r.count.replace(/[^\d]/g, "")),
            addition: r.addition,
            description: r.description
        }));

        try {
            const bulkCreateResult = await this.rewardService.bulkCreate(dataToCreate, fileConfig);
            return bulkCreateResult
        } catch (e) {
            RethrowApiError('Upload rewards error', e)
        }
    }

    async uploadPersonPack({ data, tempDirPath }: { data: TypeofPersonUploadPackSchema, tempDirPath: string }): Promise<OperationResult> {
        try {
            const names = data.map(p => p.name)

            const folderPath = path.resolve(this.__dirname, '../../../data/person/images')
            const allFiles = fs.readdirSync(folderPath)
            const filesRecord: Record<string, Express.Multer.File> = {}

            for (const filename of allFiles) {
                const base = path.parse(filename).name

                if (names.includes(base)) {
                    const srcPath = path.join(folderPath, filename)
                    const destPath = path.join(tempDirPath, filename)

                    await fse.copy(srcPath, destPath)

                    const fileObj = {
                        fieldname: "images",
                        originalname: filename,
                        encoding: "7bit",
                        mimetype: "image/*",
                        buffer: fs.readFileSync(destPath),
                        size: fs.statSync(destPath).size,
                        destination: tempDirPath,
                        filename,
                        path: destPath,
                        stream: fs.createReadStream(destPath)
                    } as Express.Multer.File

                    filesRecord[fileObj.originalname] = fileObj;
                }
            }

            const fileConfig: FileConfig = {
                tempDirPath,
                files: {
                    images: Object.values(filesRecord)
                }
            }

            const dataToCreate = data.map(p => ({
                name: p.name,
                addition: p.addition,
                description: p.description,
                rank: p.rank,
                comments: p.comments,
                rewards: p.rewards.map(r => ({ label: r.label }))
            }))
            
            const bulkCreateResult = await this.personService.bulkCreate(dataToCreate, fileConfig)
            return bulkCreateResult
        } catch (e) {
            RethrowApiError('Upload persons error', e)
        }
    }
}