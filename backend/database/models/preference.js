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
      this.belongsToMany(models.User, {
        through: models.UserPreference,
        as: 'users',
      });

      this.hasOne(models.PreferenceValue,  {
        foreignKey: {
          name: 'preference',
          as: 'values'
        }
      });

      this.belongsTo(models.PreferenceType, {as: 'type'});
    }
  }
  Preference.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typeId: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }

  }, {
    sequelize,
    modelName: 'Preference',
    tableName: 'preferences',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });
  return Preference;
};