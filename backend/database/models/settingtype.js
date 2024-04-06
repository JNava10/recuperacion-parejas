'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SettingType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Setting, {
        foreignKey: 'id',
      });
    }
  }
  SettingType.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'SettingType',
    tableName: 'setting_types',
    timestamps: false
  });
  return SettingType;
};