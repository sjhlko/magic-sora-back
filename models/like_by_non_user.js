import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';

export class LikeByNonUser extends Model {}

LikeByNonUser.init(
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'comment',
        key: 'comment_id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'like_by_non_user',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'non_user_id' },
          { name: 'comment_id' },
          { name: 'post_id' },
        ],
      },
      {
        name: 'FK_comment_TO_like_by_non_user_1',
        using: 'BTREE',
        fields: [{ name: 'comment_id' }],
      },
    ],
  },
);

