import { status } from "#src/consts/status.js";
import { TYPES } from "#src/di/types.js";
import { SendError } from "#src/lib/http/SendError.js";
import { SendResponse } from "#src/lib/http/SendResponse.js";
import { ValidateId } from "#src/shared/validations/ids/id.validate.js";
import { ValidatePaginationParams } from "#src/shared/validations/paginationParams.validate.js";
import { IMapService } from "#src/types/contracts/services/map.service.interface.js";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TypeofMapFiltersSchema } from "./schemas/MapFilters.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { ValidateObjectFieldsNotNull } from "#src/shared/validations/objectFieldsNotNull.validate.js";
import { MapPatchSchema } from "./schemas/MapPatch.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { MapUpdateSchema } from "./schemas/MapUpdate.schema.js";
import { ValidateIdArray } from "#src/shared/validations/ids/idArray.validate.js";

@injectable()
export class MapControllerImpl {
    constructor(
        @inject(TYPES.MapService) private mapService: IMapService
    ) {}

    async getMapById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            ValidateId(id)

            const map = await this.mapService.getById(id)

            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.OK,
                        message: 'Map fetched'
                    }
                ],
                data: map
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async getMapBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)

            const map = await this.mapService.getBySlug(slug)

            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.OK,
                        message: 'Map fetched'
                    }
                ],
                data: map
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async getMaps(req: Request, res: Response) {
        try {
            const offset = Number(req.query.offset) || 0
            const limit = Number(req.query.limit) || 10

            ValidatePaginationParams(offset, limit)

            const filters: Partial<TypeofMapFiltersSchema> = {
                title: req.query.title?.toString(),
                description: req.query.description?.toString(),
                year: new Date(String(req.query.year?.toString()))
            }

            const maps = await this.mapService.getList(offset, limit, filters)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: maps.length > 0 ? 'Maps fetched' : 'No maps found',
                    }
                ],
                data: maps
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async createMap(req: Request, res: Response) {
        try {
            if (!req.body.data) {
                throw ApiError.BadRequest('Missing data field in body')
            }
            if (!req.tempUploadDir) {
                throw ApiError.Internal('Server has not prepared necessary dirs')
            }

            const options = JSON.parse(req.body.data)

            ValidateObjectFieldsNotNull(options)
            const validatedOptions = MapPatchSchema.parse(options)

            const files = req.files as Record<string, Express.Multer.File[]>

            const mapFile: Express.Multer.File = files.map?.[0]

            const hasFiles = !!mapFile
            if (!hasFiles) {
                throw new ApiError(status.BAD_REQUEST, 'Map cant be created without map file. Map file is not attached')
            }

            const fileConfig: FileConfig | undefined = {
                tempDirPath: req.tempUploadDir,
                files: {
                    map: mapFile
                }
            }

            const map = await this.mapService.create(validatedOptions, fileConfig)
                        
            SendResponse(res, {
                cases: [
                    { 
                        condition: () => true,
                        status: status.CREATED,
                        message: 'Map created'
                    }
                ],
                data: map
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async updateMap(req: Request, res: Response) {
        try {
            if (!req.tempUploadDir) {
                throw ApiError.Internal('Server has not prepared necessary dirs')
            }

            const options = JSON.parse(req.body.data)
            const id = Number(req.params.id)

            const validatedOptions = MapUpdateSchema.parse(options)

            const files = req.files as Record<string, Express.Multer.File[]>
            const mapFile: Express.Multer.File = files.map?.[0]

            const hasFiles = !!mapFile
            if (!hasFiles) {
                throw new ApiError(status.BAD_REQUEST, 'Map cant be created without map file. Map file is not attached')
            }

            const fileConfig: FileConfig | undefined = {
                tempDirPath: req.tempUploadDir,
                files: {
                    map: mapFile
                }
            }

            const hasOptions = validatedOptions && Object.keys(validatedOptions).length > 0;

            if (!hasOptions && !hasFiles) {
                throw new ApiError(status.BAD_REQUEST, 'At least one option param has to be specified or file needs to be attached');
            }
            const map = await this.mapService.update(id, validatedOptions, fileConfig)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.CREATED,
                        message: 'Map updated'
                    }
                ],
                data: map
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async deleteMap(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            ValidateId(id)

            await this.mapService.delete(id)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => true,
                        status: status.OK,
                        message: 'Map deleted'
                    }
                ],  
            })
        } catch (e) {
            SendError(res, e)
        }
    }

    async bulkDeleteMaps(req: Request, res: Response) {
        try {
            const ids = String(req.query.ids).split(',').map(Number)
            ValidateIdArray(ids)

            const bulkDeleteResult = await this.mapService.bulkDelete(ids)

            SendResponse(res, {
                cases: [
                    {
                        condition: () => !bulkDeleteResult.errors,
                        status: 200,
                        message: 'Map deleted'
                    },
                    {
                        condition: () => !!bulkDeleteResult.errors && bulkDeleteResult.errors.length < ids.length,
                        status: 206,
                        message: 'Map deleted partilly'
                    },
                    {
                        condition: () => true,
                        status: 400,
                        message: 'Map were not deleted. To much invalid data'
                    }
                ],
                data: bulkDeleteResult
            })
        } catch (e) {
            SendError(res, e)
        }
    }
}