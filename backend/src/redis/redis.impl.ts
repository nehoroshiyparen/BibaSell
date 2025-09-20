import { injectable } from "inversify";
import { Redis } from "ioredis";
import { IRedis } from "#src/types/contracts/core/redis.interface.js";
import { redisConfig } from "./config.js";
import { ENV } from "#src/config/index.js";
import { ApiError } from "#src/utils/ApiError/ApiError.js";

@injectable()
export class RedisImpl implements IRedis {
    private redis: Redis

    constructor () {
        this.redis = redisConfig

        this.redis.on('connect', () => {
            console.log(`Redis is working on port: ${ENV.REDIS_PORT}`)
        })

        this.redis.on('error', (e) => {
            console.log(`Redis error: ${e}`)
        })

        this.redis.on("ready", () => {
            console.log("Redis is ready to accept commands")
        })
    }

    async setup(): Promise<void> {
        console.log('Redis connected')
    }

    async startRedisPing(): Promise<NodeJS.Timeout> {
        return setInterval(async () => {
            const isAlive = this.redis.ping()
            if (!isAlive) {
                console.log(`Redis ping failed !!!`)
            }
        }, 120000)
    }

    joinKeys(keys: string[]): string {
        let key: string = ''
        keys.forEach(part => key += part)
        return key
    }

    async setValue(key: string, value: string, expireSeconds?: number): Promise<void> {
        try {
            if (expireSeconds) {
                await this.redis.set(key, value, 'EX', expireSeconds)
            } else {
                await this.redis.set(key, value)
            }
        } catch (e) {
            throw ApiError.BadRequest(`Failed request to set value in Redis.\n Key: ${key}, Value: ${value}`, `REDIS_SET_VALUE_ERROR`, e)
        }
    }

    async getValue(key: string): Promise<string | null> {
        try {
            const value = await this.redis.get(key)
            return value
        } catch (e) {
            throw ApiError.Internal(`Redis get request error`, `REDIS_GET_ERROR`, e)
        }
    }

    async deleteValue(key: string): Promise<boolean> {
        try {
            const result = await this.redis.del(key)
            return result === 1
        } catch (e) {
            throw ApiError.Internal(`Redis del request error`, 'REDIS_DEL_ERROR', e)
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redis.exists(key)
            return result === 1
        } catch (e) {
            throw ApiError.Internal(`Redis exist error`, `REDIS_EXIST_ERROR`, e)
        }
    }

    getRedis(): Redis {
        return this.redis
    }
}