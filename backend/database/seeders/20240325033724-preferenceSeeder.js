'use strict';
const models = require('../models/index');
const preferenceFactory = require('../factories/preference.factory');
const valueFactory = require('../factories/preferenceValue.factory');
const optionFactory = require('../factories/preferenceOption.factory');
const userPreferenceFactory = require('../factories/userPreference.factory');
const {defaultPreferences} = require('../../constants/seed.const');
const {QueryTypes} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const preferenceList =  Object.values(defaultPreferences)
    const preferences = await preferenceFactory.make(preferenceList);

    await queryInterface.bulkInsert(models.Preference.tableName, preferences, {});

    const values = await valueFactory.make(preferenceList);
    const options = await optionFactory.make(preferenceList);

    const preferencesItems = await models.sequelize.query(`SELECT id FROM preferences`);
    const usersItems = await models.User.findAll({attributes: ['id']});

    const insertedPreferences = preferencesItems[0].map(item => item.id)
    const insertedUsers = usersItems.map(item => item.id)

    const userPreferences  = userPreferenceFactory.make(insertedPreferences, values, insertedUsers, options);


    await queryInterface.bulkInsert(models.PreferenceValue.tableName, values, {});
    await queryInterface.bulkInsert(models.PreferenceOption.tableName, options, {});
    await queryInterface.bulkInsert(models.UserPreference.tableName, userPreferences, {});
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
