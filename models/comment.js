import { Model, DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;

export class Comment extends Model {
  static associate(models) {}
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
      allowNull: false,
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
      {
        name: 'FK_post_TO_comment_1',
        using: 'BTREE',
        fields: { name: 'post_id' },
      },
      {
        name: 'FK_user_TO_comment_1',
        using: 'BTREE',
        fields: { name: 'user_id' },
      },
    ],
  },
);
