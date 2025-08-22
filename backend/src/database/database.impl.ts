import { Sequelize } from 'sequelize';
import { injectable } from 'inversify';
import { DatabaseAbstract } from '../types/abstractions/index.js';
import { ISequelizeModel } from '#src/types/abstractions/sequelize.model.abstraction.js';
import { sequelize as sequelizeConfig } from './config.js';

@injectable()
export class DatabaseImpl implements DatabaseAbstract {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = sequelizeConfig
  }

  public async setup() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: true });

      console.log('Database connected');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  public registerModels(model: ISequelizeModel[]): void {
    model.forEach(model => model.initialize(this.sequelize))
    model.forEach(model => {
        if (typeof model.setupAssociations === 'function') {
          model.setupAssociations()
        }
    })
  }

  public getDatabase() {
    return this.sequelize;
  }
}