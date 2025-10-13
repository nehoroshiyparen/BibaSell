import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
    APP_NAME: process.env.APP_NAME || 'NN',
    APP_PORT: Number(process.env.APP_PORT),

    DB_NAME: process.env.DB_NAME || 'ENV process error',
    DB_PASSWORD: process.env.DB_PASSWORD || 'ENV process error',
    DB_PORT: Number(process.env.DB_PORT),
    DB_HOST: process.env.DB_HOST || 'ENV process error',
    DB_USERNAME: process.env.DB_USERNAME || 'ENV process error',

    REDIS_HOST: process.env.REDIS_HOST || 'ENV process error',
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'ENV process error',

    ELASTIC_HOST: process.env.ELASTIC_HOST || 'ENV process error',
    ELASTIC_PORT: Number(process.env.ELASTIC_PORT),

    MULTER_UPLOAD_PATH: process.env.MULTER_UPLOAD_PATH ?? 'ENV process error',
    MULTER_GAP_DIR_PATH: process.env.MULTER_GAP_DIR_PATH ?? 'ENV process error',

    YC_ACCESS_KEY: process.env.YC_ACCESS_KEY?.trim() || 'ENV process error',
    YC_SECRET_KEY: process.env.YC_SECRET_KEY?.trim() || 'ENV process error'
}

console.log(JSON.stringify(ENV.YC_ACCESS_KEY), JSON.stringify(ENV.YC_SECRET_KEY))