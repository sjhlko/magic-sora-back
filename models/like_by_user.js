import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';

export class LikeByUser extends Model {
  static async deleteAllLikes(userId) {
    await this.destroy({
      where: { user_id: userId },
    });
  }
}

LikeByUser.init(
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
        model: 'comment',
        key: 'post_id',
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
  },
  {
    sequelize,
    tableName: 'like_by_user',
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
          { name: 'user_id' },
          { name: 'post_id' },
          { name: 'comment_id' },
        ],
      },
      {
        name: 'FK_comment_TO_like_by_user_1',
        using: 'BTREE',
        fields: [{ name: 'post_id' }],
      },
      {
        name: 'FK_comment_TO_like_by_user_2',
        using: 'BTREE',
        fields: [{ name: 'comment_id' }],
      },
    ],
  },
);
