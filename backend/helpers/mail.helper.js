const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        accessToken: process.env.MAIL_ACCESS_TOKEN
    }
});

const sendEmail = (to, subject, text, html) => {
    try {
        const mailOptions = {from: process.env.MAIL_USER, to, subject, text, html};

        return transporter.sendMail(mailOptions, (error, info) => {
            console.log(info)

            return !error
        });
    } catch (e) {
        console.warn(e);
        throw e;
    }
}

module.exports = {
    sendEmail
}