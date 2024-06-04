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
      this.belongsTo(models.Preference, {as: "options", foreignKey: 'preference'})
    }
  }
  PreferenceOptions.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preference: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    option_name: DataTypes.STRING,
    option_value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PreferenceOption',
    tableName: 'preference_options',
    timestamps: false
  });
  return PreferenceOptions;
};