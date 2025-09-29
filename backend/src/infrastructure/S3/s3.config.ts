import { ENV } from "#src/config/env.js";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
        accessKeyId: ENV.YC_ACCESS_KEY,
        secretAccessKey: ENV.YC_SECRET_KEY,
    }
})