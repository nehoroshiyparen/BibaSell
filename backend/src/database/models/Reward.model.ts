import { DataTypes, Model, Sequelize } from "sequelize";

export class Reward extends Model {
    declare id: number;
    declare label: string;
    declare realeseDate: string;
    declare count: number;
    declare addition?: string;
    declare description?: string;
    declare image_url?: string

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            label: { type: DataTypes.STRING, allowNull: false, unique: true },
            realeseDate: { type: DataTypes.STRING, allowNull: false },
            count: { type: DataTypes.INTEGER, defaultValue: 0 },
            addition: { type: DataTypes.TEXT, allowNull: true },
            description: { type: DataTypes.TEXT, allowNull: true },
            image_url : { type: DataTypes.STRING, allowNull: true, defaultValue: 'default.jpg' }
        }, {
            sequelize,
            modelName: 'Reward',
            tableName: 'rewards',
        });
    }
}