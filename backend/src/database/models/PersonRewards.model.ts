import { DataTypes, Model } from "sequelize";
import { db } from "..";

export class PersonRewards extends Model {
    public person_id!: number
    public reward_id!: number
}

PersonRewards.init({
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
  sequelize: db.getDatabase(),
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