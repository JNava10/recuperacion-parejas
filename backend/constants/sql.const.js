const models = require('../database/models/index');

// Buscamos todos los usuarios que tengan un nombre o nombre de usuario que empiece por la busqueda.
const findUserByNameOrNick =
    `SELECT * FROM ${models.User.tableName} ` +
    `WHERE LOWER(nickname) LIKE LOWER(CONCAT(:input, '%')) OR LOWER(name) LIKE LOWER(CONCAT(:input, '%'))`;

// Buscamos todos los usuarios que tengan un nombre completo que contenga la busqueda.
const findUserByFullname =
    `SELECT * FROM ${models.User.tableName} ` +
    `WHERE LOWER(CONCAT(name, ' ',  first_surname, ' ',  second_surname)) LIKE LOWER(CONCAT(:input, '%'))`;

module.exports = {
    findUserByNameOrNick,
    findUserByFullname
}