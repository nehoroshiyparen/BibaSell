import { DataTypes, Model, Database } from "sequelize";

export class Reward extends Model {
    public id!: number
    public label!: string
    public realeseDate!: string
    public count!: number
    public addition!: string
    public description!: string

    static initialize(sequelize: Database) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            label: { type: DataTypes.STRING, allowNull: false, unique: true },
            realeseDate: { type: DataTypes.STRING, allowNull: false },
            count: { type: DataTypes.INTEGER, defaultValue: 0 },
            addition: { type: DataTypes.TEXT, allowNull: true },
            description: { type: DataTypes.TEXT, allowNull: true },
        }, {
            sequelize: sequelize,
            modelName: 'Reward',
            tableName: 'rewards'
        })
    }
}