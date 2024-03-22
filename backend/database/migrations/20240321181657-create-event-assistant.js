'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.EventAssistant.tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      event: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: models.Event.tableName
          },
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.EventAssistant.tableName);
  }
};