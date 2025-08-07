import { Sequelize } from "sequelize";
import { ENV } from "src/config";

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
})