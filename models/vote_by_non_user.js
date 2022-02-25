import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';
export class VoteByNonUser extends Model {}

VoteByNonUser.init(
  {
    non_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'non_user',
        key: 'non_user_id',
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
      primaryKey: true,
      references: {
        model: 'choice',
        key: 'choice_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'vote_by_non_user',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'non_user_id' }, { name: 'post_id' }],
      },
      {
        name: 'FK_post_TO_vote_by_non_user_1',
        using: 'BTREE',
        fields: [{ name: 'post_id' }],
      },
    ],
  },
);
