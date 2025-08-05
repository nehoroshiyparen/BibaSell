import { Sequelize } from "sequelize"

export interface DatabaseAbstract {
    setup(): Promise<void>
    getDatabase(): Sequelize
}