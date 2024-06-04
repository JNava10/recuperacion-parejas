'use strict';const models = require('../models/index');

const userFactory = require('../factories/user.factory');
const {getRandomItem} = require("../../helpers/common.helper");
const {fr} = require("@faker-js/faker");
const {customUsers} = require("../../constants/seed.const");
const {createCustom} = require("../factories/user.factory");
const {DATE} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const factoryUserList = await userFactory.get(process.env.DEAFULT_FACTORY_USERS);
    const customUserList = [];

    for (const customUser of customUsers) {
      const user = await createCustom(
          customUser.name,
          customUser.firstSurname,
          customUser.secondSurname,
          customUser.nickname,
          customUser.email
      );

      customUserList.push(user)
    }

    // Con el spread operator podemos crear un array a partir de la copia de las dos listas de usuarios, para insertar todas de golpe.
    await queryInterface.bulkInsert(models.User.tableName, [...factoryUserList, ...customUserList], {});

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
