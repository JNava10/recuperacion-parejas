'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
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
    id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PreferenceOptions',
  });
  return PreferenceOptions;
};