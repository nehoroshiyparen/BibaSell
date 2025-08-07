import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
    APP_NAME: process.env.APP_NAME || 'NN',
    APP_PORT: Number(process.env.APP_PORT),
    DB_NAME: process.env.DB_NAME || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_PORT: Number(process.env.DB_PORT),
    DB_HOST: process.env.DB_HOST || '',
    DB_USERNAME: process.env.DB_USERNAME || '',
}