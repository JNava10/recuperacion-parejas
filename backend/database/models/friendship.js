'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Friendship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Friendship.init({
    requesting_user: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    requested_user: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Friendship',
    tableName: 'friendships',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Friendship;
};