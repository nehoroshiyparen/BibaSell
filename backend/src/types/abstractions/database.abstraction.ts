import { Sequelize } from "sequelize"
import { ISequelizeModel } from "./sequelize.model.abstraction"

export interface DatabaseAbstract {
    setup(): Promise<void>
    registerModels(model: ISequelizeModel[]): void
    getDatabase(): Sequelize
}