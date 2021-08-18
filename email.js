const nodeMailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const keys = require('./config/keys');

const auth = {
    auth: {
        api_key: keys.MAILGUN_API_KEY,
        domain: keys.MAILGUN_DOMAIN
    }
}

const transporter = nodeMailer.createTransport(mailgun(auth));

const sendEmail = (sender_email, email_subject, email_content, cb) => {
    const emailOptions = {
        from: sender_email,
        to: keys.DESTINATION_EMAIL,
        subject: email_subject,
        text: email_content
    }
    transporter.sendMail(emailOptions, (error, data) => {
        if (error) {
            cb(error, null);
        } else {
            cb(null, data);
        }
    });
};

module.exports = sendEmail;