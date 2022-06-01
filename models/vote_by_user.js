import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';
export class VoteByUser extends Model {
  static associate(models) {
    this.belongsTo(models.Post, {
      foreignKey: 'post_id',
      targetKey: 'post_id',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
  }
  static async deleteVoteByUser(id) {
    await this.destroy({
      where: { post_id: id },
    });
  }

  static async deleteUserVote(id) {
    await this.destroy({
      where: { user_id: id },
    });
  }

  static async getUserVote({ userId, postId }) {
    return await this.findOne({
      where: [{ user_id: userId }, { post_id: postId }],
    });
  }

  static async getChoiceScore({ postId, choiceId }) {
    return await this.findAll({
      where: [{ post_id: postId }, { choice_id: choiceId }],
    });
  }
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
      primaryKey: true,
      references: {
        model: 'choice',
        key: 'choice_id',
      },
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
    ],
  },
);
