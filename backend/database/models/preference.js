'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Preference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // Una preferencia solo puede tener un valor en caso de ser numerica.
      this.belongsToMany(models.User, {
        through: models.UserPreference,
        as: 'users',
      });

      // Una preferencia solo puede tener un valor en caso de ser numerica.
      this.hasOne(models.PreferenceValue,  {
        foreignKey: {
          name: 'preference',
          as: 'values'
        }
      });
    }
  }
  Preference.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    }

  }, {
    sequelize,
    modelName: 'Preference',
    tableName: 'preferences',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Preference;
};