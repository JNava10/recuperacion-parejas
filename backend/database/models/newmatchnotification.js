'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const models = require("./index");
module.exports = (sequelize, DataTypes) => {
  class NewMatchNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewMatchNotification.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(Date.now())
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(Date.now())
    }
  }, {
    sequelize,
    modelName: 'NewMatchNotification',
    tableName: 'new_match_notifications',
    underscored: true
  });
  return NewMatchNotification;
};