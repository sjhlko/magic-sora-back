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

  static async getUserVote(id) {
    return await this.findOne({
      where: [{ user_id: id.user }, { post_id: id.post }],
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
      {
        name: 'FK_post_TO_vote_by_user_1',
        using: 'BTREE',
        fields: [{ name: 'post_id' }],
      },
    ],
  },
);
