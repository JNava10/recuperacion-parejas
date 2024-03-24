'use strict';

const models = require('../models/index');
const {roleNames} = require("../../constants/auth.constants");
const roleFactory = require("../factories/role.factory");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const names = Object.values(roleNames);
    const roles = roleFactory.get(names);

    await queryInterface.bulkInsert(models.Role.tableName, roles, {});

    const roleFields = await models.Role.findAll({attributes: ['id']});
    const userFields = await models.User.findAll({attributes: ['id']});

    let roleIndex = 0;

    for (const userField of userFields) {
      await models.AssignedRole.create({
        user: userField.id,
        role: roleFields[roleIndex].id
      });

      // Podemos reiniciar el contador usando un modulo, para que cada vez que el resto sea 0, se reinicie el contador.
      if (roleIndex % roleFields.length - 1 === 0) roleIndex = 0;
      else roleIndex++;
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
