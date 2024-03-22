'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.MessageFile.tableName, {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.Message.tableName
          },
          key: 'id'
        }
      },
      file_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.MessageFile.tableName);
  }
};