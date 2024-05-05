'use strict';
const {
  Model,
    DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: models.AssignedRole,
        foreignKey: 'user',
        as: 'roles'
      });

      this.belongsToMany(models.Event, {
        through: models.EventAssistant,
        foreignKey: 'user',
        as: 'events'
      });

      this.hasMany(models.Message, {
        foreignKey: 'emitter',
        as: 'sendedMessages'
      })

      // this.hasMany(models.Message, {
      //   foreignKey: 'receiver',
      //   as: 'receivedMessages'
      // })

      this.belongsToMany(models.User, {
        through: models.Friendship,
        as: 'friendships',
      });

      this.belongsToMany(models.Preference, {
        through: models.UserPreference,
        as: 'preferences',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    second_surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    pic_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    connected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return User;
};