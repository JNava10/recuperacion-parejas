'use strict';const models = require('../models/index');
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.NewMatchNotification.tableName, {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        default: new Date(Date.now())
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        default: new Date(Date.now())
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.NewMatchNotification.tableName);
  }
};