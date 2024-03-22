'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Preferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Preference)
    }
  }
  Preferences.init({
    preference: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    min_value: DataTypes.INTEGER,
    max_value: DataTypes.INTEGER,
    default_value: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PreferenceValue',
    tableName: 'preference_values',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Preferences;
};