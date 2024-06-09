'use strict';

const eventFactory = require("../factories/event.factory");
const models = require("../models");
const {getRandomItem} = require("../../helpers/common.helper");
const EventQuery = require("../query/event.query");
const EventController = require("../../controllers/event.controller");
const EventUtils = require("../../utils/event.utils");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const events = await eventFactory.get(3)

    await queryInterface.bulkInsert(models.Event.tableName, events, {});

    const eventsInserted = await models.Event.findAll({attributes: ['id', 'name', 'description', 'createdAt']});

    for (const i in eventsInserted) {
      const event = eventsInserted[i]
      const uploadedFile = await EventUtils.generateSummaryFile(event);

      console.log(uploadedFile)

      await models.Event.update({where: {summary_url: uploadedFile.secure_url}})
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
