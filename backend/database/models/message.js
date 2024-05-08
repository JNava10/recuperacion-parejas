const models = require('../models/index')
'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'userEmitter',
        targetKey: 'id',
        foreignKey: 'emitter'
      })

      this.belongsTo(models.User, {
        as: 'receivedMessages',
        foreignKey: 'receiver'
      })

      this.hasMany(models.MessageFile, {
        foreignKey: 'message',
        as: 'files'
      })
    }
  }
  Message.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    emitter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Message;
};