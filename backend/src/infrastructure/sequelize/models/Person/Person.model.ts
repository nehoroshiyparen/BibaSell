import { DataTypes, Model, Sequelize } from "sequelize";
import { Reward } from "../Reward/Reward.model.js";

export class Person extends Model {
    declare id: number
    declare slug: string;
    declare name: string
    declare addition?: string
    declare description?: string
    declare rank?: string
    declare comments?: string
    declare key: string // S3 key

    declare rewards: Reward[]

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            slug: { type: DataTypes.STRING, unique: true, allowNull: true },
            key: { type: DataTypes.STRING, allowNull: true },
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