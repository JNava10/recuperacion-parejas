'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Match extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'userToMatch', as: 'userMatch'})
      this.belongsTo(models.User, {foreignKey: 'userWhoMatched', as: 'userMatched'})
    }
  }
  Match.init({
    userWhoMatched: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userToMatch: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    underscored: true
  });
  return Match;
};