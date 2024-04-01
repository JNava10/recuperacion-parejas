'use strict';
const models = require('../models/index');
const preferenceFactory = require('../factories/preference.factory');
const valueFactory = require('../factories/preferenceValue.factory');
const optionFactory = require('../factories/preferenceOption.factory');
const {defaultPreferences} = require('../../constants/seed.constants');
const {QueryTypes} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const preferenceList =  Object.values(defaultPreferences)
    const results = await preferenceFactory.make(preferenceList);

    await queryInterface.bulkInsert(models.Preference.tableName, results, {});

    const values = await valueFactory.make(preferenceList);
    const options = await optionFactory.make(preferenceList);

    await queryInterface.bulkInsert(models.PreferenceValue.tableName, values, {});
    await queryInterface.bulkInsert(models.PreferenceOption.tableName, options, {});

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
