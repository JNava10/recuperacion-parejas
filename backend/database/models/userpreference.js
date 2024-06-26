'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class UserPreferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Preference, {as: "options", foreignKey: 'preference'})
    }
  }
  UserPreferences.init({
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    preference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'UserPreference',
    tableName: 'user_preferences',
    timestamps: false
  });
  return UserPreferences;
};