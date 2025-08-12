import { DataTypes, Model, NonAttribute, Database } from "sequelize";
import { sequelize as sequelizeConfig } from "../config";
import { Heading } from "./Heading.model";

export class Article extends Model {
    public id!: number

    public title: string
    public slug!: string

    public cover_image_url: string

    public author_username!: string

    public content_markdown!: string

    public event_start_date!: Date
    public event_end_date!: Date

    public is_published!: boolean

    declare readonly headings?: NonAttribute<Heading[]>;

    static initialize(sequelize: Database) {
        this.init({
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

            title: { type: DataTypes.STRING, unique: true, allowNull: false },
            slug: { type: DataTypes.STRING, unique: true, allowNull: false },

            cover_image_url: { type: DataTypes.STRING, allowNull: true, defaultValue: './pulbic/defaultCover' },
            
            author_username: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Не указан' },

            content_markdown: { type: DataTypes.TEXT, allowNull: false },

            event_start_date: { type: DataTypes.DATE, allowNull: true, defaultValue: 'Не указано' },
            event_end_date: { type: DataTypes.DATE, allowNull: true, defaultValue: 'Не указано' },

            is_published: { type: DataTypes.BOOLEAN, defaultValue: true }, // На время разработки поставлю defaultValue: true
        }, {
            sequelize,
            modelName: 'Article',
            tableName: 'article',
        })

        this.setupAssociations()
    }

    static setupAssociations() {
        this.belongsTo(Heading, {
            foreignKey: 'article_id',
            onDelete: 'CASCADE',
            as: 'headings'
        })
    }
}