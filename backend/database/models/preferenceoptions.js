'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class PreferenceOptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PreferenceOptions.init({
    preference: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    option_name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    option_value: {
      allowNull: false,
      type: DataTypes.NUMBER,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'PreferenceOption',
    tableName: 'preference_options'
  });
  return PreferenceOptions;
};