import { DataTypes, Model, Sequelize } from "sequelize";
import { Article } from "./Article.model";

export class ArticleFile extends Model {
    declare id: number;
    declare article_id: number;

    declare path: string;
    declare originalName: string;

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            article_id: { type: DataTypes.INTEGER, allowNull: false },
            path: { type: DataTypes.STRING, allowNull: false },
            originalName: { type: DataTypes.STRING, allowNull: false, unique: true }
        }, {
            sequelize,
            modelName: 'ArticleFile',
            tableName: 'articleFile'
        })
    }

    static setupAssociations() {
        this.belongsTo(Article, {
            foreignKey: 'article_id',
            onDelete: 'CASCADE',
        })
    }
}