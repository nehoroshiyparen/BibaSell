import { TYPES } from "#src/di/types.js";
import { IMapService } from "#src/types/contracts/services/map.service.interface.js";
import { inject, injectable } from "inversify";
import { MapSequelizeRepo } from "./map.sequelize.repo.js";
import { S3MapServiceImpl } from "./S3Map.service.impl.js";
import { MapMapper } from "./map.mapper.js";
import { TypeofMapFullSchema } from "./schemas/MapFull.schema.js";
import { FileConfig } from "#src/types/interfaces/files/FileConfig.interface.js";
import { TypeofMapPatchSchema } from "./schemas/MapPatch.schema.js";
import { TypeofMapUpdateSchema } from "./schemas/MapUpdate.schema.js";
import { OperationResult } from "#src/types/interfaces/http/OperationResult.js";

@injectable()
export class MapServiceImpl implements IMapService {
    constructor(
        @inject(TYPES.MapSequelizeRepo) private sequelize: MapSequelizeRepo,
        @inject(TYPES.S3MapService) private s3: S3MapServiceImpl,
        @inject(TYPES.MapMapper) private mapper: MapMapper,
    ) {}

    async getById(id: number): Promise<TypeofMapFullSchema> {
        try {

            return
        } catch (e) {

        }
    }

    async getBySlug(slug: string): Promise<TypeofMapFullSchema> {
        try {

            return
        } catch (e) {

        }
    }

    async getList(offset?: number, limit?: number, filters?: Partial<{ title: string; description: string; year: Date; }> | undefined): Promise<{ id: number; title: string; slug: string; year: Date; key: string; }[]> {
        try {

            return
        } catch (e) {

        }
    }

    async create(options: TypeofMapPatchSchema, fileConfig: FileConfig): Promise<TypeofMapFullSchema> {
        try {

            return
        } catch (e) {

        }
    }

    async update(id: number, options: TypeofMapUpdateSchema, fileConfig: FileConfig | undefined): Promise<TypeofMapFullSchema> {
        try {

            return
        } catch (e) {

        }
    }

    async delete(id: number): Promise<void> {
        try {

            return
        } catch (e) {

        }
    }

    async bulkDelete(ids: number[]): Promise<OperationResult> {
        try {

            return
        } catch (e) {

        }
    }
}