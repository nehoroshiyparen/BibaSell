import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { Heading } from "./Heading.model.js";
import { ArticleFile } from "./ArticleFiles.model.js";

export class Article extends Model {
    declare id: number;

    declare title: string;
    declare slug: string;

    declare cover_image_url: string;

    declare author_username: string;

    declare content_markdown: string;

    declare event_start_date: Date;
    declare event_end_date: Date;

    declare is_published: boolean;

    declare readonly headings?: NonAttribute<Heading[]>;

    static initialize(sequelize: Sequelize) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

            title: { type: DataTypes.STRING, unique: true, allowNull: false },
            slug: { type: DataTypes.STRING, unique: true, allowNull: false },

            cover_image_url: { type: DataTypes.STRING, allowNull: true, defaultValue: './public/defaultCover' },

            author_username: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Не указан' },

            content_markdown: { type: DataTypes.TEXT, allowNull: false },

            event_start_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
            event_end_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },

            is_published: { type: DataTypes.BOOLEAN, defaultValue: true }, // На время разработки поставлю defaultValue: true
        }, {
            sequelize,
            modelName: 'Article',
            tableName: 'article',
        });
    }

    static setupAssociations() {
        this.hasMany(Heading, {
            foreignKey: 'article_id',
            onDelete: 'CASCADE',
            as: 'headings'
        });

        this.hasMany(ArticleFile, {
            foreignKey: 'article_id',
            onDelete: 'CASCADE',
            as: 'files'
        })
    }
}
