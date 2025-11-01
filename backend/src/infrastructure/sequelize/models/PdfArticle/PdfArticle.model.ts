import { DataTypes, Model, Sequelize } from "sequelize";
import { fa } from "zod/locales";
import { Author } from "../Author/Author.model.js";

export class PdfArticle extends Model {
    declare id: number
    declare title: string
    declare slug: string
    declare key: string
    declare preview_key: string
    declare defaultPreview: string
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
            preview_key: { type: DataTypes.TEXT, allowNull: true , unique: true },
            defaultPreview: {type: DataTypes.TEXT, allowNull: false, unique: false }, // path for deafult cover
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