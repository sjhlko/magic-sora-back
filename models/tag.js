import { Model, DataTypes } from 'sequelize';
import db from './index.js';

const sequelize = db.sequelize;

export class Tag extends Model {
  static associate(models) {}
}

Tag.init(
  {
    tag_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tag',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'tag_id' }],
      },
    ],
  },
);
