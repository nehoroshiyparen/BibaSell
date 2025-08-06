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
      host: 'db', // или process.env.DB_HOST, если переменная точно есть
      port: 5432, // или Number(process.env.DB_PORT)
      username: 'nehoroshiyparen', // ⚠️ Жёстко прописанное значение
      password: '1212', // ⚠️ И пароль тоже
      database: 'BIBACELL',
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