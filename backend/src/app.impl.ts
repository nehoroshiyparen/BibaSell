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
    ) {
        this.#router = indexRouter.getRouter()

        this.name = ENV.APP_NAME
        this.port = ENV.APP_PORT

        this.#middlewares = []
    }

    public async setup() {
        try {
            this.database.registerModels([Person, Reward, PersonRewards, MDXArticle, Heading, MDXArticleFile])
            await this.database.setup()

            await this.elastic.createIndexes(mappings)
            await this.redis.setup()

            this.#app.use(express.json())
            this.#app.use(cors())
            this.#app.use(this.#router)
            this.setupMiddlewares(this.#middlewares)

            this.redis.startRedisPing()

            this.#app.listen(this.port, () => {
                console.log(`App '${this.name}' started on port ${this.port}`)
            })
        } catch (err) {
            console.error('Error during app setup:', err)
            process.exit(1)
        }
    }

    private setupMiddlewares(middlewares: RequestHandler[]) {
        if (middlewares.length === 0) return
        this.#app.use(...middlewares)
    }
}