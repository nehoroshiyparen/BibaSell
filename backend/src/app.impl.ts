import express, { Express, RequestHandler, Router } from 'express'
import cors from 'cors'
import { IndexRouter } from '#src/routes/index.js'
import { IApp, IDatabase } from './types/contracts/index.js'
import { inject, injectable } from 'inversify'
import { DatabaseImpl } from './infrastructure/sequelize/database.impl.js'
import { TYPES } from './di/types.js'
import { ENV } from './config/index.js'
import { Person } from './infrastructure/sequelize/models/Person/Person.model.js'
import { Reward } from './infrastructure/sequelize/models/Reward/Reward.model.js'
import { PersonRewards } from './infrastructure/sequelize/models/Associations/PersonRewards.model.js'
import { RedisImpl } from './infrastructure/redis/redis.impl.js'
import { Heading } from './infrastructure/sequelize/models/MDXArticle/Heading.model.js'
import { MDXArticle } from './infrastructure/sequelize/models/MDXArticle/MDXArticle.model.js'
import { MDXArticleFile } from './infrastructure/sequelize/models/MDXArticle/MDXArticleFiles.model.js'
import { ElasticImpl } from './infrastructure/elastic/elastic.impl.js'
import { mappings } from './infrastructure/elastic/mappings/index.js'
import { PdfArticle } from './infrastructure/sequelize/models/PdfArticle/PdfArticle.model.js'
import { Author } from './infrastructure/sequelize/models/Author/Author.model.js'
import { AppLogger } from './lib/logger/instances/app.logger.js'

@injectable()
export class AppImpl implements IApp {
    public name: string = 'NN'
    public port: number

    #app: Express = express()
    #router: Router

    #middlewares: RequestHandler[] = []

    constructor (
        @inject(TYPES.IndexRouter) private readonly indexRouter: IndexRouter,
        @inject(TYPES.Database) private readonly database: DatabaseImpl,
        @inject(TYPES.Redis) private readonly redis: RedisImpl,
        @inject(TYPES.Elastic) private readonly elastic: ElasticImpl,
        @inject(TYPES.AppLogger) private readonly logger: AppLogger,
    ) {
        this.#router = indexRouter.getRouter()

        this.name = ENV.APP_NAME
        this.port = ENV.APP_PORT

        this.#middlewares = []
    }

    public async init() {
        this.logger.info('App is initializing...')
        
        await this.setupStore('Sequelize', async () => {
            this.database.registerModels([Person, Reward, PersonRewards, PdfArticle, Author])
            await this.database.setup()
        })

        await this.setupStore('Elastic', async () => {
            await this.elastic.createIndexes(mappings)
        })

        await this.setupStore('Redis', async () => {
            await this.redis.setup()
        })
    }

    public async start() {
        this.#app.use(express.json())
        this.#app.use(cors())
        this.#app.use(this.#router)
        this.setupMiddlewares(this.#middlewares)
        this.redis.startRedisPing()

        this.#app.listen(this.port, () => {
            this.logger.started(this.name, this.port)
        })
    }

    public async setup() {
        try {
            await this.init()
            await this.start()
        } catch (err) {
            this.logger.error(`Error while app setup: ${String(err)}`)
            process.exit(1)
        }
    }

    private async setupStore(name: string, fn: () => Promise<void>) {
        try {
            await fn()
            this.logger.storeInitialized(name)
        } catch (e) {
            this.logger.storeFailed(name, e)
            throw e
        }
    }

    private setupMiddlewares(middlewares: RequestHandler[]) {
        if (middlewares.length === 0) return
        this.#app.use(...middlewares)
    }
}