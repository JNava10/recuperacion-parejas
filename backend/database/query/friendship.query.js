const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {jpegminiMedium} = require("@cloudinary/url-gen/qualifiers/quality");

class FriendshipQuery {

}

module.exports = FriendshipQuery