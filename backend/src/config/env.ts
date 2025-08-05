import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
    APP_NAME: process.env.APP_NAME || 'NN',
    APP_PORT: Number(process.env.APP_PORT),
    DB_NAME: process.env.DB_NAME || '',
    DB_PASSWORD: process.env.MAIN_DB_PASSWORD || '',
    DB_PORT: Number(process.env.MAIN_DB_PORT),
    DB_USERNAME: process.env.MAIN_DB_USERNAME || '',
}