'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.Message.tableName, {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      emitter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      receiver: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.Message.tableName);
  }
};