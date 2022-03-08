import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';
export class Post extends Model {
  static associate(models) {
    this.hasMany(models.Choice, {
      foreignKey: 'post_id',
      sourceKey: 'post_id',
    });
    this.hasMany(models.Comment, {
      foreignKey: 'post_id',
      sourceKey: 'post_id',
    });

    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'user_id',
    });

    this.belongsToMany(models.User, {
      through: models.VoteByUser,
      foreignKey: 'post_id',
    });

    this.hasMany(models.VoteByUser, {
      foreignKey : 'post_id', sourceKey: 'post_id'
    });

    this.belongsToMany(models.NonUser, {
      through: models.VoteByNonUser,
      foreignKey: 'post_id',
    });
    this.belongsToMany(models.Tag, {
      through: models.TagOfPost,
      foreignKey: 'post_id',
    });
  }

  async getPostInfo(author) {
    let tags = await this.getTags({
      attributes: ['tag_name'],
    });
    tags = tags.map(tag => {
      return tag.tag_name;
    });

    const thumbnail = await this.getChoices({
      attributes: ['photo_url'],
      limit: 1,
    });

    const comments = await this.getComments({
      attributes: ['comment_id'],
    });

    return {
      id: this.post_id,
      title: this.post_title,
      registerDate: this.register_date,
      author: author.nickname,
      tags: tags,
      thumbnail: thumbnail[0].photo_url,
      commentNum: comments.length,
    };
  }
}

Post.init(
  {
    post_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id',
      },
    },
    post_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    post_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    register_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    finish_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'post',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'post_id' }],
      },
      {
        name: 'FK_user_TO_post_1',
        using: 'BTREE',
        fields: [{ name: 'user_id' }],
      },
    ],
  },
);
