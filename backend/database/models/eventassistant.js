'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const models = require("./index");
module.exports = (sequelize, DataTypes) => {
  class EventAssistant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EventAssistant.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: models.User,
        key: 'id'
      }
    },
    event: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: models.Event,
        key: 'id'
      }
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
    },
  }, {
    sequelize,
    modelName: 'EventAssistant',
    tableName: 'event_assistants',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return EventAssistant;
};