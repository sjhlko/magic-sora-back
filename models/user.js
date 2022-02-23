import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index.js';
export class User extends Model {
  // model 간의 관계를 정의하는 함수 (다른 모델들도 모두 동일)
  static associate(models) {
    this.hasMany(models.Post, { foreignKey: 'user_id', sourceKey: 'user_id' });
    this.hasMany(models.Comment, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
    });

    this.belongsToMany(models.Tag, {
      through: models.InterestedTag,
      foreignKey: 'user_id',
    });
    this.belongsToMany(models.Comment, {
      through: models.LikeByUser,
      foreignKey: 'user_id',
    });
    this.belongsToMany(models.Post, {
      through: models.VoteByUser,
      foreignKey: 'user_id',
    });
  }
}

User.init(
  {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR(1),
      allowNull: true,
    },
    mbti: {
      type: DataTypes.CHAR(4),
      allowNull: true,
    },
    profile_pic_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user',
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: { name: 'user_id' },
      },
    ],
  },
);
