import { injectable } from 'inversify'
import { Sequelize } from 'sequelize'
import { DatabaseAbstract } from 'src/types/abstractions'

@injectable()
export class DatabaseImpl implements DatabaseAbstract {
    name: string
    #database: Sequelize

    constructor (
        name: string,
        database: Sequelize
    ) {
        this.name = name
        this.#database = database
    }

    public async setup() {
        try {
            await this.#database.authenticate()
            await this.#database.sync({ alter: true })

            console.log(`🟢 Database '${this.name}' is started`)
        } catch (e) {
            console.log(`🔴 Failed to connect database: ${e}`)
        }
    }

    public getDatabase() {
        return this.#database
    }
}