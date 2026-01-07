import { SendError } from "#src/lib/http/SendError.js";
import { SendResponse } from "#src/lib/http/SendResponse.js";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import rewardsJSON from "#src/data/rewards/rewards.json" with { type: 'json'}
import personJSON from "#src/data/person/person.json" with { type: "json" };
import { RewardUploadPackSchema } from "../schemas/RewardUploadPack.schema.js";
import { IUploadService } from "#src/types/contracts/services/upload.service.interface.js";
import { status } from "#src/consts/status.js";
import { TYPES } from "#src/di/types.js";
import { PersonUploadPackSchema } from "../schemas/PersonUploadPack.schema.js";

@injectable()
export class UploadControllerImpl {
    constructor(
        @inject(TYPES.UploadService) private uploadService: IUploadService
    ) {}

    async uploadRewardPack(req: Request, res: Response) {
        try {
            const data = rewardsJSON
            const validatedData = RewardUploadPackSchema.parse(data.rewards)
            const result = await this.uploadService.uploadRewardsPack({ data: validatedData, tempDirPath: req.tempUploadDir! })
            SendResponse(res, {
                cases: [
                    {
                        condition: () => result.success,
                        status: status.OK,
                        message: 'Rewards uploaded'
                    },
                    {
                        condition: () => result.created !== 0,
                        status: status.PARTIAL_CONTENT,
                        message: 'Not all of rewards were uploaded'
                    },
                    {
                        condition: () => result.created === 0,
                        status: status.BAD_REQUEST,
                        message: 'Rewards were not uploaded'
                    }
                ],
                data: result
            })
        } catch (e) {
            SendError(res,e )
        }
    } 

    async uploadPersonPack(req: Request, res: Response) {
        try {
            const data = personJSON
            const validatedData = PersonUploadPackSchema.parse(data.persons)
            const result = await this.uploadService.uploadPersonPack({ data: validatedData, tempDirPath: req.tempUploadDir! })
            SendResponse(res, {
                cases: [
                    {
                        condition: () => result.success,
                        status: status.OK,
                        message: 'Persons uploaded'
                    },
                    {
                        condition: () => result.created !== 0,
                        status: status.PARTIAL_CONTENT,
                        message: 'Not all of persons were uploaded'
                    },
                    {
                        condition: () => result.created === 0,
                        status: status.BAD_REQUEST,
                        message: 'Persons were not uploaded'
                    }
                ],
                data: result
            })
        } catch (e) {
            SendError(res, e)
        }
    }
}