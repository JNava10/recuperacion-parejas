'use strict';
const models = require('../models/index');
const typeFactory = require("../factories/settingType.factory");
const settingFactory = require("../factories/setting.factory");
const {settingTypes, defaultSettings} = require("../../constants/seed.constants");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const names = Object.values(settingTypes);
    const types = typeFactory.make(names);

    console.log(types)

    const typesInserted =  await queryInterface.bulkInsert(models.SettingType.tableName, types, {})  === 1;

    if (typesInserted) {
      const settings = await settingFactory.makeMany(defaultSettings);

      const settingsInserted =  await queryInterface.bulkInsert(models.Setting.tableName, settings, {})  === 1;

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
