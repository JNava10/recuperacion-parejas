'use strict';

const eventFactory = require("../factories/event.factory");
const models = require("../models");
const {getRandomItem} = require("../../helpers/common.helper");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const events = await eventFactory.get(3)

    await queryInterface.bulkInsert(models.Event.tableName, events, {});

    const userFields = await models.User.findAll({attributes: ['id']});
    const eventFields = await models.Event.findAll({attributes: ['id']});

    for (const i in eventFields) {
      const userId = getRandomItem(userFields).id
      const eventId = eventFields[i].id;

      await models.EventAssistant.create({
        event: eventId,
        user: userId,
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
