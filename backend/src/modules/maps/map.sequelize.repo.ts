import { TYPES } from "#src/di/types.js";
import { BaseSequelizeRepo } from "#src/infrastructure/sequelize/base.sequelize-repo.js";
import { Map } from "#src/infrastructure/sequelize/models/map.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { stringifyObject } from "#src/shared/utils/stringifyObject.js";
import { IDatabase } from "#src/types/contracts/index.js";
import { inject, injectable } from "inversify";
import { Transaction } from "sequelize";

@injectable()
export class MapSequelizeRepo extends BaseSequelizeRepo<Map> {
    constructor(
        @inject(TYPES.Database) private database: IDatabase,
        @inject(TYPES.SequelizeLogger) protected logger: StoreLogger
    ) {
        super(database.getDatabase(), Map, logger)
    }

    async create(
        data: any & { slug: string },
        options?: { key: string },
        transaction?: Transaction
    ): Promise<Map> {
        const map = await Map.create(
            {
                ...data,
                ...options
            }, { transaction }
        )
        this.logger.operations.created(stringifyObject(map), map.id)
        return map
    }
}