'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
const {tr} = require("@faker-js/faker");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.PreferenceOption.tableName, {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      preference: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: models.Preference.tableName
          },
          key: 'id'
        }
      },
      option_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      option_value: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.PreferenceOption.tableName);
  }
};