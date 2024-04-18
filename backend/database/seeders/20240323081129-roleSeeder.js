'use strict';

const models = require('../models/index');
const {roleNames, customUsers} = require("../../constants/seed.constants");
const roleFactory = require("../factories/role.factory");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const names = Object.values(roleNames);
    const roles = roleFactory.get(names);

    await queryInterface.bulkInsert(models.Role.tableName, roles, {});

    // Buscamos los registros en la base de datos para saber sus IDs.
    const roleFields = await models.Role.findAll();
    const userFields = await models.User.findAll();

    // Filtramos los roles segun su nombre para poder asignarlos a un usuario especifico si es necesario.
    const memberRole = roleFields.find(role => role.name === roleNames.member.name);
    const adminRole = roleFields.find(role => role.name === roleNames.admin.name);

    let roleIndex = 0;

    for (const userField of userFields) {
      const customUser = customUsers.find(user => user.email === userField.email);

      if (customUser) {
        const userIsAdmin = customUser.roles.find(role => role === roleNames.admin.name);
        const userIsMember = customUser.roles.find(role => role === roleNames.member.name);

        let role;

        console.log(customUser.roles, roleNames)


        // Dependiendo del rol del usuario, se le asignará uno u otro.
        if (userIsAdmin) {
          role = adminRole
        } else if (userIsMember) {
          role = memberRole
        }

        await models.AssignedRole.create({
          user: userField.id,
          role: role.id
        });
      } else {
        // Si es aleatorio, simplemente se asignará un rol secuencialmente, reiniciando el contador si ya no hay mas roles asignables.
        await models.AssignedRole.create({
          user: userField.id,
          role: roleFields[roleIndex].id
        });

        // Podemos reiniciar el contador usando un modulo, para que cada vez que el resto sea 0, se reinicie el contador.
        if (roleIndex % roleFields.length - 1 === 0) roleIndex = 0;
        else roleIndex++;
      }
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
