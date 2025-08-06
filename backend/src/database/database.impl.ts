import { Sequelize } from 'sequelize';
import { injectable } from 'inversify';
import { DatabaseAbstract } from '../types/abstractions';
import { ISequelizeModel } from 'src/types/abstractions/sequelize.model.abstraction';

@injectable()
export class DatabaseImpl implements DatabaseAbstract {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logging: false
    });
  }

  public async setup() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync();
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  public registerModels(model: ISequelizeModel[]): void {
    model.forEach(model => model.initialize(this.sequelize))
  }

  public getDatabase() {
    return this.sequelize;
  }
}