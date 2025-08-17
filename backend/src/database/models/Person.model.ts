import { DataTypes, Model, Sequelize } from "sequelize";

export class Person extends Model {
    declare id: number
    declare name: string
    declare addition?: string
    declare description?: string
    declare rank?: string
    declare comments?: string

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            addition: { type: DataTypes.TEXT, allowNull: true },
            description: { type: DataTypes.TEXT, allowNull: true },
            rank: { type: DataTypes.TEXT, allowNull: true },
            comments: { type: DataTypes.TEXT, allowNull: true },
        }, {
            sequelize: sequelize,
            modelName: 'Person',
            tableName: 'persons',
        })
    }
}