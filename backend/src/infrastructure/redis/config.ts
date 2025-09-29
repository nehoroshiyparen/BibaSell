import { Redis } from "ioredis";
import { ENV } from "#src/config/index.js";

export const redisConfig = new Redis({
    host: ENV.REDIS_HOST,
    port: ENV.REDIS_PORT,
    password: ENV.REDIS_PASSWORD,
    retryStrategy: (times) => {
        console.log(`[Redis] Попытка переподключения #${times}`);
        return Math.min(times * 100, 5000);
    },
})