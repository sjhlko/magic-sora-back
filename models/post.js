import { Model, DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;

export class Post extends Model {
  static associate(models) {}
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
