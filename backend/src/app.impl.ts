import express, { Express, RequestHandler, Router } from 'express'
import { container } from './di/container'
import { IndexRouter } from 'src/routes/index'
import { AppAbstract, DatabaseAbstract } from './types/abstractions'
import { inject, injectable } from 'inversify'
import { DatabaseImpl } from './database/database.impl'
import { TYPES } from './di/types'
import { ENV } from './config'
import { Person } from './database/models/Person.model'
import { Reward } from './database/models/Reward.model'
import { PersonRewards } from './database/models/PersonRewards.model'

@injectable()
export class AppImpl implements AppAbstract {
    public name: string = 'NN'
    public port: number

    #app: Express = express()
    #router: Router
    #database: DatabaseImpl

    #middlewares: RequestHandler[] = []

    constructor (
        @inject(TYPES.IndexRouter) private readonly indexRouter: IndexRouter,
        @inject(TYPES.Sequelize) private readonly database: DatabaseImpl
    ) {
        this.#router = indexRouter.getRouter()
        this.#database = database

        this.name = ENV.APP_NAME
        this.port = ENV.APP_PORT

        this.#middlewares = []
    }

    public async setup() {
        this.#database.registerModels([Person, Reward, PersonRewards])
        await this.#database.setup()

        this.#app.use('/api', this.#router)
        this.setupMiddlewares(this.#middlewares)

        this.#app.listen(this.port, () => {
            console.log(`App '${this.name}' started on port ${this.port}`)
        })
    }

    private setupMiddlewares(middlewares: RequestHandler[]) {
        if (middlewares.length === 0) return
        this.#app.use(...middlewares)
    }
}