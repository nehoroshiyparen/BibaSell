import { Redis } from "ioredis"

export interface RedisAbstract {
    setup(): void
    startRedisPing(): Promise<NodeJS.Timeout>

    joinKeys(keys: string[]): string 

    setValue(key: string, value: string, expireSeconds?: number): Promise<void>
    getValue(key: string): Promise<string | null>
    deleteValue(key: string): Promise<boolean>
    exists(key: string): Promise<boolean>

    getRedis(): Redis
}