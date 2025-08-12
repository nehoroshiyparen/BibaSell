import { DataTypes, Model, Database } from "sequelize";
import { Person } from "./Person.model";
import { Reward } from "./Reward.model";

export class PersonRewards extends Model {
    public person_id!: number
    public reward_id!: number

    static initialize(sequelize: Database) {
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
      
      this.setupAssociations()
    }

    private static setupAssociations() {
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