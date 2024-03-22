'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.PreferenceValue.tableName, {
      preference: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false,
        references: {
          model: {
            tableName: models.Preference.tableName
          },
          key: 'id'
        }
      },
      min_value: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      max_value: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      default_value: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.PreferenceValue.tableName);
  }
};