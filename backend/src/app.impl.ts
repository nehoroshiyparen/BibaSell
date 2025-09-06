import express, { Express, RequestHandler, Router } from 'express'
import cors from 'cors'
import { IndexRouter } from '#src/routes/index.js'
import { AppAbstract, DatabaseAbstract } from './types/abstractions/index.js'
import { inject, injectable } from 'inversify'
import { DatabaseImpl } from './database/database.impl.js'
import { TYPES } from './di/types.js'
import { ENV } from './config/index.js'
import { Person } from './database/models/Person.model.js'
import { Reward } from './database/models/Reward.model.js'
import { PersonRewards } from './database/models/PersonRewards.model.js'
import { RedisImpl } from './redis/redis.impl.js'
import { Heading } from './database/models/Heading.model.js'
import { Article } from './database/models/Article.model.js'
import { ArticleFile } from './database/models/ArticleFiles.model.js'

@injectable()
export class AppImpl implements AppAbstract {
    public name: string = 'NN'
    public port: number

    #app: Express = express()
    #router: Router
    #database: DatabaseImpl
    #redis: RedisImpl

    #middlewares: RequestHandler[] = []

    constructor (
        @inject(TYPES.IndexRouter) private readonly indexRouter: IndexRouter,
        @inject(TYPES.Database) private readonly database: DatabaseImpl,
        @inject(TYPES.Redis) private readonly redis: RedisImpl,
    ) {
        this.#router = indexRouter.getRouter()
        this.#database = database
        this.#redis = redis

        this.name = ENV.APP_NAME
        this.port = ENV.APP_PORT

        this.#middlewares = []
    }

    public async setup() {
        try {
            this.#database.registerModels([Person, Reward, PersonRewards, Article, Heading, ArticleFile])
            await this.#database.setup()

            this.redis.setup()

            this.#app.use(express.json())
            this.#app.use(cors())
            this.#app.use(this.#router)
            this.setupMiddlewares(this.#middlewares)

            this.#redis.startRedisPing()

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