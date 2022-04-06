import { Model, DataTypes, Op } from 'sequelize';
import sequelize from './index.js';
import { models } from './init-models.js';
export class Comment extends Model {
  static associate(models) {
    this.belongsToMany(models.User, {
      through: models.LikeByUser,
      foreignKey: 'comment_id',
    });

    this.belongsTo(models.Post, {
      foreignKey: 'post_id',
      targetKey: 'post_id',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });
  }
  static async findById(id) {
    return await this.findOne({
      where: { comment_id: id },
    });
  }
  static async deleteComment(id) {
    await this.destroy({
      where: { post_id: id },
    });
  }

  static async addLikes(id) {
    await this.findOne({
      where: { comment_id: id },
    }).then(comment => {
      return comment.increment('number_of_like', { by: 1 });
    });
  }

  static async deleteLikes(id) {
    await this.findOne({
      where: { comment_id: id },
    }).then(comment => {
      return comment.decrement('number_of_like', { by: 1 });
    });
  }
  static async getBestComments(id) {
    return await this.findAll({
      where: { post_id: id, number_of_like: { [Op.gt]: 0 } },
      order: [['number_of_like', 'DESC']],
      limit: 3,
    });
  }
  static async getRestComments(post_id, comment_id) {
    return await this.findAll({
      where: { comment_id: { [Op.notIn]: comment_id }, post_id: post_id },
      order: [['comment_id', 'DESC']],
    });
  }
  async getCommentInfo(status) {
    const author = await models.User.findById(this.user_id, [
      'nickname',
      'profile_pic_url',
    ]);
    const profile = author ? author.profile_pic_url : 'default image';
    const voteNum = await models.VoteByUser.getUserVote({
      userId: this.user_id,
      postId: this.post_id,
    });
    //DB에 투표안한사람들도 댓글 쓴 경우가 있어서 일단 임시방편
    let choiceId = voteNum ? voteNum.choice_id : 0;
    return {
      id: this.comment_id,
      choiceId: choiceId,
      status: status,
      author: author.nickname,
      profile: profile,
      registerDate: this.register_date,
      likes: this.number_of_like,
      content: this.comment_content,
    };
  }
}

Comment.init(
  {
    comment_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'post_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'user_id',
      },
    },
    register_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    number_of_like: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    comment_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comment',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: { name: 'comment_id' },
      },
    ],
  },
);
