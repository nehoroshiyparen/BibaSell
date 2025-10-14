import { Sequelize } from 'sequelize';
import { inject, injectable } from 'inversify';
import { IDatabase } from '#src/types/contracts/index.js';
import { ISequelizeModel } from '#src/types/contracts/core/sequelize.model.interface.js';
import { sequelize as sequelizeConfig } from './config.js';
import { TYPES } from '#src/di/types.js';
import { StoreLogger } from '#src/lib/logger/instances/store.logger.js';
import { ENV } from '#src/config/env.js';

@injectable()
export class DatabaseImpl implements IDatabase {
    private sequelize: Sequelize;

    constructor(
        @inject(TYPES.SequelizeLogger) private logger: StoreLogger
    ) {
        this.sequelize = sequelizeConfig
    }

    public async setup() {
        try {
            await this.sequelize.authenticate();
            await this.sequelize.sync({ alter: true });

            this.logger.lifecycle.started(ENV.DB_PORT)
        } catch (error) {
            this.logger.exceptions.storeException(error)
            throw error;
        }
    }

    public registerModels(models: ISequelizeModel[]): void {
        models.forEach(model => model.initialize(this.sequelize))
        models.forEach(model => {
              if (typeof model.setupAssociations === 'function') {
                model.setupAssociations()
              }
        })
    }

    public getDatabase() {
        return this.sequelize;
    }
}