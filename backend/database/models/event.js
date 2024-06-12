'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.EventAssistant,
        foreignKey: 'event',
        as: 'assistants'
      });
    }
  }
  Event.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: process.env.DEFAULT_EVENT_PIC_URL,
    },
    summaryUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: process.env.DEFAULT_EVENT_SUMMARY
    },
    scheduledDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
    paranoid: true,
    underscored: true
  });
  return Event;
};