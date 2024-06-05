'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PreferenceType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Preference, {foreignKey: 'typeId'})
    }
  }
  PreferenceType.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PreferenceType',
    timestamps: false
  });
  return PreferenceType;
};