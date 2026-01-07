import { TYPES } from "#src/di/types.js";
import { BaseSequelizeRepo } from "#src/infrastructure/sequelize/base.sequelize-repo.js";
import { ExtendedTransaction } from "#src/infrastructure/sequelize/extentions/Transaction.js";
import { Map } from "#src/infrastructure/sequelize/models/map.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { stringifyObject } from "#src/shared/utils/stringifyObject.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { Transaction } from "sequelize";
import { TypeofMapPatchSchema } from "./schemas/MapPatch.schema.js";
import { TypeofMapUpdateSchema } from "./schemas/MapUpdate.schema.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";

@injectable()
export class MapSequelizeRepo extends BaseSequelizeRepo<Map> {
    constructor(
        @inject(TYPES.Database) private database: IDatabase,
        @inject(TYPES.SequelizeLogger) protected logger: StoreLogger
    ) {
        super(database.getDatabase(), Map, logger)
    }

    async create(
        data: TypeofMapPatchSchema & { slug: string, key: string },
        transaction?: ExtendedTransaction
    ): Promise<Map> {
        const map = await Map.create(
            {
                ...data,
            }, { transaction }
        )
        this.logger.operations.created(stringifyObject(map), map.id)
        return map
    }

    async update(
        id: number,
        data: TypeofMapUpdateSchema & { slug?: string, key?: string },
        transaction?: Transaction
    ): Promise<Map> {
        const map = await Map.findByPk(id)
        if (!map) throw ApiError.NotFound(`Map with id: ${id} does not exists`)
        return await map.update({ ...data, updatedAt: new Date() }, { transaction })
    }
}