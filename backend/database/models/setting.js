'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    value: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Setting',
    tableName: 'settings'
  });
  return Setting;
};