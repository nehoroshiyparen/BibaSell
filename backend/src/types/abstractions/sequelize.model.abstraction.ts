import { Sequelize } from 'sequelize';

export interface ISequelizeModel {
    initialize(sequelize: Sequelize): void;
}