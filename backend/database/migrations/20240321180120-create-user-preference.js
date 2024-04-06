'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.UserPreference.tableName, {
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      preference: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: models.Preference.tableName
          },
          key: 'id'
        }
      },
      value: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.UserPreference.tableName);
  }
};