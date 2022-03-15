import { Model, DataTypes, Op } from 'sequelize';
import sequelize from './index.js';
import { generateToken, hashPassword } from '../library/index.js';

export class User extends Model {
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

    this.hasMany(models.VoteByUser, {
      foreignKey: 'user_id',
      sourceKey: 'user_id',
    });
  }

  static async localRegister(newUser) {
    return await this.create(newUser);
  }

  static async findById(id, attributes) {
    return await this.findOne({
      where: { user_id: id },
      attributes: attributes,
    });
  }

  static async findByEmail(email, attributes) {
    return await this.findOne({
      where: { user_email: email },
      attributes: attributes,
    });
  }

  static async findByNickname(nickname, attributes) {
    return await this.findOne({
      where: { nickname: { [Op.like]: nickname } },
      attributes: attributes,
    });
  }

  static async updateUser(id, newUser) {
    const user = await this.findOne({
      where: { user_id: id },
    });
    await user.update(newUser);
    return user;
  }

  static async findWithModel(id, model, attributes, order) {
    const options = {
      where: { user_id: id },
      attributes: ['user_id'],
      include: [
        {
          model: model,
          attributes: attributes,
          through: {
            where: { user_id: id },
          },
        },
      ],
    };

    if (order) {
      options.order = [order];
    }

    return await this.findOne(options);
  }

  async getMyPosts() {
    return await this.getPosts({
      attributes: ['post_id', 'post_title', 'register_date'],
      order: [['register_date', 'ASC']],
    });
  }

  static async generateToken() {
    const payload = {
      user_id: this.user_id,
    };
    return generateToken(payload, 'user');
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
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue('password', hashPassword(value));
      },
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
