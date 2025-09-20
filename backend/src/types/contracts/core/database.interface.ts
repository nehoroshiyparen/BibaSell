import { Sequelize } from "sequelize"
import { ISequelizeModel } from "./sequelize.model.interface.js"

export interface IDatabase {
    setup(): Promise<void>
    registerModels(model: ISequelizeModel[]): void
    getDatabase(): Sequelize
}