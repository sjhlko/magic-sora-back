import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';
export class Choice extends Model {
  static associate(models) {
    this.belongsTo(models.Post, {
      foreignKey: 'post_id',
      targetKey: 'post_id',
    });
  }
  static async deleteChoice(id) {
    await this.destroy({
      where: { post_id: id },
    });
  }
}

Choice.init(
  {
    choice_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
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
    choice_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'choice',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'choice_id' }, { name: 'post_id' }],
      },
      {
        name: 'FK_post_TO_choice_1',
        using: 'BTREE',
        fields: [{ name: 'post_id' }],
      },
    ],
  },
);
