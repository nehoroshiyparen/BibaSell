import { DataTypes, Model, Sequelize } from "sequelize";
import { Person } from "./Person.model.js";
import { Reward } from "./Reward.model.js";

export class PersonRewards extends Model {
    declare person_id: number
    declare reward_id: number

    static initialize(sequelize: Sequelize) {
      this.init({
        person_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'persons', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        reward_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'rewards', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }
      }, {
        sequelize,
        modelName: 'PersonRewards',
        tableName: 'person_rewards',
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ['person_id', 'reward_id'],
          },
        ]
      })
    }

    static setupAssociations() {
      Person.belongsToMany(Reward, {
        through: PersonRewards,
        foreignKey: 'person_id',
        otherKey: 'reward_id',
        as: 'rewards'
      })

      Reward.belongsToMany(Person, {
        through: PersonRewards,
        foreignKey: 'reward_id',
        otherKey: 'person_id',
        as: 'persons'
      })
    }
}