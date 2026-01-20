import { DataTypes, Model, Sequelize } from "sequelize";

export class Map extends Model {
  declare id: number;
  declare title: string;
  declare slug: string;
  declare description: string;
  declare year: number;
  declare key: string;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false, unique: true },
        slug: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        year: { type: DataTypes.INTEGER, allowNull: true },
        key: { type: DataTypes.STRING, allowNull: false, unique: true },
      },
      {
        sequelize,
        modelName: "Map",
        tableName: "maps",
        timestamps: true,
      },
    );
  }
}
