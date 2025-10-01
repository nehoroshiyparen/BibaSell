import { DataTypes, Model, Sequelize } from "sequelize";
import { fa } from "zod/locales";

export class PdfArticle extends Model {
    declare id: number
    declare title: string
    declare slug: string
    declare key: string
    declare extractedText: string
    declare pusblishedAt: Date
    declare updatedAt: Date

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.STRING, unique: false, allowNull: false },
            slug: { type: DataTypes.STRING, unique: true, allowNull: false },
            key: { type: DataTypes.TEXT, allowNull: false },
            extractedText: { type: DataTypes.TEXT, allowNull: false },
            publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now().toLocaleString() },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now().toLocaleString() },
        }, {
            sequelize,
            modelName: 'PdfArticle',
            tableName: 'pdfArticles',
            timestamps: false,
        })
    }
}