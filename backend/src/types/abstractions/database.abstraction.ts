import { Sequelize } from "sequelize"
import { ISequelizeModel } from "./sequelize.model.abstraction.js"

export interface DatabaseAbstract {
    setup(): Promise<void>
    registerModels(model: ISequelizeModel[]): void
    getDatabase(): Sequelize
}