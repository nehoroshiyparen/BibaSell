import { DataTypes, Model, Sequelize } from "sequelize";

export class Author extends Model {
    declare id: number
    declare name: string

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false }
        }, {
            sequelize,
            modelName: 'Author',
            tableName: 'authors'
        })
    }
}