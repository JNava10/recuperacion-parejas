const {generateSecureInt, generateSecureHex} = require("../helpers/common.helper");

class RecoverController {
    /**
     *
     * @type {Map<string, {tokenCode: string, recoverCode: string, expiresAt: Date}>}
     */
    static entries = new Map();

    static defaultMinuteLife = 3 // Cantidad de minutos que durará el codigo.

    static set = (email) => {
        const recoverCode = generateSecureInt(100000, 999999).toString();
        const tokenCode = generateSecureHex(15);

        const date = new Date(Date.now());
        const expiresAt = new Date(date.setMinutes(
            date.getMinutes() + RecoverController.defaultMinuteLife
        ));

        const entry = {
            tokenCode,
            recoverCode,
            expiresAt
        };

        RecoverController.entries.set(email, {...entry})

        return entry
    }

    static get = (email) => {

    }
}

module.exports = RecoverController