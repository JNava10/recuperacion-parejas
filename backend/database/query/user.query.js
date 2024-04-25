
const models = require('../models/index');
const {findUserByNameOrNick, findUserByFullname} = require("../../constants/sql.const");
const {QueryTypes, Op} = require("sequelize");
const QuerySuccess = require("../../classes/QuerySuccess");
const QueryError = require("../../classes/QueryError");
const {jpegminiMedium} = require("@cloudinary/url-gen/qualifiers/quality");

class UserQuery {
    /**
     *
     * @returns {Promise<Model|null>}
     * @param input
     */
    static findUserByNickOrName = async (input) => {
        return await models.sequelize.query(findUserByNameOrNick, {type: QueryTypes.SELECT, model: models.User, replacements: { input: input }});
    }

    /**
     *
     * @param {string} email
     * @returns {Promise<Model|null>}
     */
    static findUserByEmail = async (email) => {
        return await models.User.findOne({where: {email: email}});
    }

    /**
     *
     * @param {string} email
     * @param {string} roleName
     * @returns {Promise<boolean>}
     */
    static userHasRole = async (email, roleName) => {
        return await models.User.findOne({
            where: {email: email},
            include: {model: models.Role, where: {name: roleName}, as: 'roles'}
        });
    }

    static findUserLikeFullname = async (input) => {
        return await models.sequelize.query(findUserByFullname, {type: QueryTypes.SELECT, model: models.User, replacements: { input: input }});
    };

    static findChatMessages = async (emitter, receiver) => {
        try {
            const query = await models.User.findOne({
                where: {id: emitter},
                include: {
                    model: models.Message,
                    where: {
                        // Deben obtenerse los mensajes de ambos, por ello se obtienen los mensajes de uno u otros, independientemente de si son emisores o receptores.
                        [Op.or]: [
                            {[Op.and]: {emitter: emitter, receiver: receiver}},
                            {[Op.and]: {emitter: receiver, receiver: emitter}}
                        ]
                    },
                    as: 'messages'
                }
            });

            return new QuerySuccess(true, query);
        } catch (e) {
            console.warn(e)
            return new QueryError(false, e)
        }
    };

    static pushMessage = async (emitter, receiver, text) => {
        try {
            const data = {
                emitter,
                receiver,
                text,
                read: false,
                created_at: new Date(),
                updated_at: new Date(),

            };

            const query = await models.Message.create(data);

            return new QuerySuccess(true, query);
        } catch (e) {
            return new QueryError(false, e)
        }
    };
}

module.exports = UserQuery