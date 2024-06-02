const {generateSecureInt, generateSecureHex} = require("../helpers/common.helper");
const {generateToken} = require("../helpers/jwt.helper");
const jwt = require("jsonwebtoken");

class RecoverController {
    /**
     *
     * @type {Map<string, {tokenCode: string, recoverCode: string, expiresAt: Date}>}
     */
    static entries = new Map();

    static codeMinuteLife = 10 // Minutos de duración del codigo.
    static tokenMinuteLife = 5 // Minutos para poder cambiar la contraseña, de lo contrario expirará el token.

    static set = (email) => {
        const recoverCode = generateSecureInt(100000, 999999).toString();
        const tokenCode = generateSecureHex(15);

        const date = new Date(Date.now());
        const expiresAt = new Date(date.setMinutes(
            date.getMinutes() + RecoverController.codeMinuteLife
        ));

        const entry = {
            tokenCode,
            recoverCode,
            expiresAt
        };

        RecoverController.entries.set(email, {...entry})

        return entry
    }

    static validateCode = (inputEmail, inputCode) => {
        console.log(RecoverController.entries)
        const entry = RecoverController.entries.get(inputEmail);

        if (!entry.recoverCode) return {
            message: "No se ha encontrado ningun email coincidente. Vuelve a pedir el codigo e intentalo de nuevo.",
            isValid: false
        }

        if (inputCode === entry.recoverCode) {
            const token = generateToken({authCode: entry.tokenCode, email: inputEmail}, `${RecoverController.tokenMinuteLife}m`)

            return {
                message: "Se ha validado correctamente el codigo.",
                isValid: true,
                token
            }
        }
        else return {
            message: "El codigo introducido no es valido.",
            isValid: false
        }
    }

    static validateToken = async (token) => {
        try {
            if (!token) return {
                message: "No se ha encontrado ningun token.",
            }

            const {authCode, email} = await jwt.verify(token, process.env.PRIVATE_KEY);

            if (!authCode) return {
                message: "El token no es valido o ha expirado.",
            }

            const entry = RecoverController.entries.get(email);

            if (!entry) return {
                message: "No se ha encontrado ningun email coincidente.",
            }

            if (entry.tokenCode === authCode) return {
                email,
            };
            else return false;
        } catch (e) {
            if (e.name === 'TokenExpiredError') return {
                message: "El token de recuperación introducido está caducado.",
            }
            else return {
                message: `Ha ocurrido un error al validar el token de recuperación (${e.name}).`,
            }
        }
    }
}

module.exports = RecoverController