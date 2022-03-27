import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';
export class TagOfPost extends Model {
  static async deleteTagOfPost(id) {
    await this.destroy({
      where: { post_id: id },
    });
  }
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
    ],
  },
);
