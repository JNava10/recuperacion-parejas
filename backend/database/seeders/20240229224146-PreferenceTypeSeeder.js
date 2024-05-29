const models = require('../models/index');
const {preferenceTypes} = require("../../constants/seed.const");
const preferenceType = require("../factories/preferenceType.factory");
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const types = preferenceType.make(
        Object.values(preferenceTypes)
    );

    await queryInterface.bulkInsert(models.PreferenceType.tableName, types)
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete(models.PreferenceType.tableName, null, {});
  }
};
