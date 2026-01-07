import { DataTypes, Model, Sequelize } from "sequelize";
import { Author } from "../author.js";
import { PdfArticle } from "../pdf_article.js";

export class PdfArticleAuthors extends Model {
    declare author_id: number
    declare pdfArticle_id: number

    static initialize(sequelize: Sequelize) {
        this.init({
            author_id: { 
                type: DataTypes.INTEGER, 
                allowNull: false, 
                references: { model: 'authors', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            pdfArticle_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'pdfArticles', key: 'id' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }
        }, {
            sequelize,
            modelName: 'PdfArticleAuthors',
            tableName: 'pdfArticle_authors',
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['author_id', 'pdfArticle_id']
                }
            ]
        })
    }

    static setupAssociations() {
        Author.belongsToMany(PdfArticle, {
            through: PdfArticleAuthors,
            foreignKey: 'author_id',
            otherKey: 'pdfArticle_id',
            as: 'pdfArticles'
        })

        PdfArticle.belongsToMany(Author, {
            through: PdfArticleAuthors,
            foreignKey: 'pdfArticle_id',
            otherKey: 'author_id',
            as: 'authors'
        })
    }
}