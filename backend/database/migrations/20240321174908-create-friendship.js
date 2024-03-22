'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.Friendship.tableName, {
      requesting_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      requested_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.Friendship.tableName);
  }
};