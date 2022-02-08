import { Model, DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;

export class VoteByUser extends Model {
  static associate(models) {}
}

VoteByUser.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'post_id',
      },
    },
    choice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'vote_by_user',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'user_id' }, { name: 'post_id' }],
      },
      {
        name: 'FK_post_TO_vote_by_user_1',
        using: 'BTREE',
        fields: [{ name: 'post_id' }],
      },
    ],
  },
);
