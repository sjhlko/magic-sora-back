import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';

export class InterestedTag extends Model {
  static async deleteAllTags(userId) {
    await this.destroy({
      where: { user_id: userId },
    });
  }
}

InterestedTag.init(
  {
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'tag_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'interested_tag',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'tag_id' }, { name: 'user_id' }],
      },
    ],
  },
);
