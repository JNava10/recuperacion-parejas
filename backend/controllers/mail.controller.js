const {generateSecureInt, generateSecureHex} = require("../helpers/common.helper");
const nodemailer = require('nodemailer');

class MailController {

    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_REFRESH_TOKEN,
            accessToken: process.env.MAIL_ACCESS_TOKEN
        }
    });

    sendEmail = (to, subject, text) => {
        try {
            const mailOptions = {from: process.env.MAIL_USER, to, subject, text};

            this.transporter.sendMail(mailOptions, (error, info) => !error);
        } catch (e) {
            console.warn(e);
            throw e;
        }
    }

    module.exports = {
        enviarCorreo
    }
}

module.exports = MailController