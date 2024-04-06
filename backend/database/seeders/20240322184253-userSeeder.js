'use strict';const models = require('../models/index');

const userFactory = require('../factories/user.factory');
const {getRandomItem} = require("../../helpers/common.helper");
const {fr} = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await userFactory.get(3)

    console.log(users);

    await queryInterface.bulkInsert(models.User.tableName, users, {});

    const userFields = await models.User.findAll({attributes: ['id']});

    // Insertamos las amistades.

    for (const userField of userFields) {
      // Math.random() devuelve un numero entre 0 y 1,
      // podemos aprovechar esto para obtener un boolean aleatorio.
      const accepted = Boolean(Math.round(Math.random()));

      const friendUser = getRandomItem(userFields);

      await models.Friendship.create({
        requesting_user: userField.id,
        requested_user: friendUser.id,
        accepted: accepted,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
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
