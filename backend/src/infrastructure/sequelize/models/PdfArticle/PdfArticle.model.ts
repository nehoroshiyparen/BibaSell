import { DataTypes, Model, Sequelize } from "sequelize";

export class PdfArticle extends Model {
    declare id: number
    declare title: string
    declare pusblishedAt: Date
    declare filePath: string
    declare extractedText: string

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            title: { type: DataTypes.STRING, unique: false, allowNull: false },
            pusblishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now().toLocaleString() },
            filePath: { type: DataTypes.TEXT, allowNull: false },
            extractedText: { type: DataTypes.TEXT, allowNull: false }
        }, {
            sequelize,
            modelName: 'PdfArticle',
            tableName: 'pdfArticles'
        })
    }
}