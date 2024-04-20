const models = require('../database/models/index');

// Buscamos todos los usuarios que tengan un nombre o nombre de usuario que empieze por la busqueda.
const findUserByNameOrNick =
    `SELECT * FROM ${models.User.tableName} ` +
    `WHERE LOWER(nickname) LIKE LOWER(CONCAT(:input, '%')) OR LOWER(name) = LOWER(CONCAT(:input, '%'))`;

// Buscamos todos los usuarios que tengan un nombre completo que contenga la busqueda.
const findUserByFullname =
    `SELECT * FROM ${models.User.tableName} ` +
    `WHERE LOWER(CONCAT(name, first_surname, second_surname)) LIKE CONCAT('%', LOWER(:input), '%')`;

module.exports = {
    findUserByNameOrNick,
    findUserByFullname
}