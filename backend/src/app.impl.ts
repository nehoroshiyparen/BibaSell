import express, { Express, RequestHandler, Router } from 'express'
import { container } from 'src/di/container'
import { IndexRouter } from 'src/routes'
import { AppAbstract } from './types/abstractions'
import { injectable } from 'inversify'
import { DatabaseImpl } from './database/database.impl'

@injectable()
export class AppImpl implements AppAbstract {
    public name: string = 'NN'
    public port: number

    #app: Express = express()
    #router: Router
    #database: DatabaseImpl

    #middlewares: RequestHandler[] = []

    constructor (
        name: string,
        port: number,
    ) {
        this.#router = container.get(IndexRouter).getRouter()
        this.#database = container.get(DatabaseImpl)

        this.name = name
        this.port = port

        this.#middlewares = []
    }

    public async setup() {
        await this.#database.setup()

        this.#app.use('/api', this.#router)
        this.#app.use(...this.#middlewares)

        this.#app.listen(this.port, () => {
            console.log(`App '${this.name}' started on port ${this.port}`)
        })
    }
}