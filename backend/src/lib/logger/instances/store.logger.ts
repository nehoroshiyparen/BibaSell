import { injectable } from "inversify"
import { Logger } from "../base.logger.js"

export class StoreLogger extends Logger {
    private storeName: string

    constructor(storeName: string, logFile: string) {
        super(storeName, logFile)

        this.storeName = storeName
    }

     operations = {
        created: (entity: string, id: number | string) =>
        this.info(`The record has been created [${entity}] Id=${id}`),

        updated: (entity: string, id: number | string) =>
        this.info(`The record has been updated [${entity}] Id=${id}`),

        deleted: (id: number | number[] | string, entity?: string) =>
        this.warn(`The record has been deleted ${entity ? `[${entity}]` : ''} Id=${id}`),

        fetched: (entity: string, query?: Record<string, any>, count?: number) => {
            const queryStr = JSON.stringify(query)
            this.debug(`Request [${entity}] with filter ${queryStr}${count ? ` - found ${count}` : ''}`)
        }
    }

    lifecycle = {
        started: (port: number) =>
        this.info(`Store ${this.storeName} is started on port: ${port}`),

        stopped: () =>
        this.warn(`Store ${this.storeName} is stopped`)
    }

    transactions = {
        started: (name: string) =>
        this.info(`Transaction-${name} is started`),

        commited: (name: string) =>
        this.info(`Transaction-${name} is commited`),

        rolledBack: (name: string, reason?: string) =>
        this.error(`Transaction-${name} is rolled back ${reason ? `Reason: ${reason}` : ''}`)
    }

    exceptions = {
        storeException: (e: unknown, comment?: string) =>
        this.error(`Error occured in store ${this.storeName}. ${comment} ${String(e)}`)
    }
}

export const sequelizeLogger = new StoreLogger('Sequelize', 'sequelize.log')
export const elasticLogger = new StoreLogger('Elastic', 'elastic.log')
export const s3Logger = new StoreLogger('S3', 's3.log')
export const redisLogger = new StoreLogger('Redis', 'redis.log')