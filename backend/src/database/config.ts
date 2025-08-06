import { Sequelize } from "sequelize";
import { ENV } from "src/config";

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'db', // или process.env.DB_HOST, если переменная точно есть
  port: 6543, // или Number(process.env.DB_PORT)
  username: 'nehoroshiyparen', // ⚠️ Жёстко прописанное значение
  password: '1212', // ⚠️ И пароль тоже
  database: 'BIBACELL',
  logging: true
})