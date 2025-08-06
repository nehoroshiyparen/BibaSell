import { DataTypes, Model, Sequelize } from "sequelize";

export class Person extends Model {
    public id!: number
    public name!: string
    public surname!: string
    public patronymic!: string
    public addition!: string
    public description!: string
    public rank!: string
    public comments!: string

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            surname: { type: DataTypes.STRING, allowNull: false },
            patronymic: { type: DataTypes.STRING, allowNull: false },
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