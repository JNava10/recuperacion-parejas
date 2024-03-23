'use strict';const models = require('../models/index');

const userFactory = require('../factories/user.factory');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await userFactory.get(3)

    return await queryInterface.bulkInsert(models.User.tableName, users, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
