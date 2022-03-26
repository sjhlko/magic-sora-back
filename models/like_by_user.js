import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';

export class LikeByUser extends Model {
  static async deleteAllLikes(userId) {
    return await this.destroy({
      where: { user_id: userId },
    });
  }
  static async findLikes(user_id, post_id, comment_id) {
    return await this.findOne({
      where: {
        user_id: user_id,
        post_id: post_id,
        comment_id: comment_id,
      },
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
    ],
  },
);
