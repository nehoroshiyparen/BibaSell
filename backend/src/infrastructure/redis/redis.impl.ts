import { inject, injectable } from "inversify";
import { Redis } from "ioredis";
import { IRedis } from "#src/types/contracts/core/redis.interface.js";
import { redisConfig } from "./config.js";
import { ENV } from "#src/config/index.js";
import { ApiError } from "#src/shared/ApiError/ApiError.js";
import { StoreLogger } from "#src/lib/logger/instances/store.logger.js";
import { TYPES } from "#src/di/types.js";

@injectable()
export class RedisImpl implements IRedis {
    private redis: Redis

    constructor (
        @inject(TYPES.RedisLogger) private logger: StoreLogger
    ) {
        this.redis = redisConfig

        this.redis.on('connect', () => {
            this.logger.lifecycle.started(ENV.REDIS_PORT)
        })

        this.redis.on('error', (e) => {
            this.logger.exceptions.storeException(e)
        })

        this.redis.on("ready", () => {
            this.logger.info('Redis is ready to accept commands')
        })
    }

    async setup(): Promise<void> {
        this.logger.lifecycle.started(ENV.REDIS_PORT)
    }

    async startRedisPing(): Promise<NodeJS.Timeout> {
        return setInterval(async () => {
            const isAlive = this.redis.ping()
            if (!isAlive) {
                this.logger.error('Redis ping failed !!!')
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