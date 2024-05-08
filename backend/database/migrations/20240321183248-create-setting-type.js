'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.SettingType.tableName, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.SettingType.tableName);
  }
};