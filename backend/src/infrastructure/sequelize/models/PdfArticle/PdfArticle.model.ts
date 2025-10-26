import { DataTypes, Model, Sequelize } from "sequelize";
import { fa } from "zod/locales";
import { Author } from "../Author/Author.model.js";

export class PdfArticle extends Model {
    declare id: number
    declare title: string
    declare slug: string
    declare key: string
    declare firstpage_key: string
    declare extractedText: string
    declare publishedAt: Date
    declare updatedAt: Date

    declare authors?: Author[]

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.STRING, unique: false, allowNull: false },
            slug: { type: DataTypes.STRING, unique: true, allowNull: false },
            key: { type: DataTypes.STRING, allowNull: false, unique: true },
            firstpage_key: { type: DataTypes.TEXT, allowNull: false , unique: true },
            extractedText: { type: DataTypes.TEXT, allowNull: false },
            publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date()},
        }, {
            sequelize,
            modelName: 'PdfArticle',
            tableName: 'pdfArticles',
            timestamps: false,
        })
    }
}