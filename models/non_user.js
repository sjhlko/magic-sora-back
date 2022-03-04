import { Model, DataTypes } from 'sequelize';
import sequelize from './index.js';
export class NonUser extends Model {
  static associate(models) {
    this.belongsToMany(models.Comment, {
      through: models.LikeByNonUser,
      foreignKey: 'non_user_id',
    });
    this.belongsToMany(models.Choice, {
      through: models.VoteByNonUser,
      foreignKey: 'non_user_id',
    });
  }
}

NonUser.init(
  {
    non_user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    IP_address: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'non_user',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'non_user_id' }],
      },
    ],
  },
);
