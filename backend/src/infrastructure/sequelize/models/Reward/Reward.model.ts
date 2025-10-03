import { DataTypes, Model, Sequelize } from "sequelize";

export class Reward extends Model {
    declare id: number;
    declare slug: string;
    declare label: string;
    declare realeseDate: string;
    declare count: number;
    declare addition?: string;
    declare description?: string;
    declare key?: string // S3 key

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            slug: { type: DataTypes.STRING, unique: true, allowNull: true },
            label: { type: DataTypes.STRING, allowNull: false, unique: true },
            realeseDate: { type: DataTypes.STRING, allowNull: false },
            count: { type: DataTypes.INTEGER, defaultValue: 0 },
            addition: { type: DataTypes.TEXT, allowNull: true },
            description: { type: DataTypes.TEXT, allowNull: true },
            image_url : { type: DataTypes.STRING, allowNull: true }
        }, {
            sequelize,
            modelName: 'Reward',
            tableName: 'rewards',
        });
    }
}