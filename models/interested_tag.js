import { Model, DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;

export class InterestedTag extends Model {
  static associate(models) {}
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
      {
        name: 'FK_user_TO_interested_tag_1',
        using: 'BTREE',
        fields: [{ name: 'user_id' }],
      },
    ],
  },
);
