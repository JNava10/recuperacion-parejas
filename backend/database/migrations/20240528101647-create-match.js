'use strict';
const models = require("../models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(models.Match.tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      user_who_matched: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },

      user_to_match: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: models.User.tableName
          },
          key: 'id'
        }
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        default: new Date(Date.now())
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        default: new Date(Date.now())
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(models.Match.tableName);
  }
};