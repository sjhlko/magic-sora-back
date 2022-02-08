import { Model, DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;

export class TagOfPost extends Model {
  static associate(models) {}
}

TagOfPost.init(
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'post_id',
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'tag_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'tag_of_post',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'post_id' }, { name: 'tag_id' }],
      },
      {
        name: 'FK_tag_TO_tag_of_post_1',
        using: 'BTREE',
        fields: [{ name: 'tag_id' }],
      },
    ],
  },
);
