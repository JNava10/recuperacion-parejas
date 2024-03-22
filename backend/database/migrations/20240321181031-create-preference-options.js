'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.PreferenceOption.tableName, {
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
      option_name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      option_value: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.PreferenceOption.tableName);
  }
};