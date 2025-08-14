import { DataTypes, Model, Sequelize } from "sequelize";
import { Article } from "./Article.model";

export class Heading extends Model {
    public id!: number
    public title!: string
    public article_id!: number

    static initaialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: {type: DataTypes.STRING, allowNull: false },
            articleId: { type: DataTypes.INTEGER, allowNull: false }
        }, {
            sequelize,
            modelName: 'Heading',
            tableName: 'heading',
            indexes: [
                {
                    unique: true,
                    fields: ['title', 'article_id'],
                    name: 'unique_heading_per_article'
                }
            ]
        })

        this.setupAssociations()
    }

    static setupAssociations() {
        this.belongsTo(Article, {
            foreignKey: 'article_id',
            onDelete: 'CASCADE',
        })
    }
}