import nodemailer from 'nodemailer';
import config from "../config/index";

let transporter = nodemailer.createTransport({
    host: config.SMTP_MAIL_HOST,
    port: config.SMTP_MAIL_PORT,
    secure: false,
    auth: {
        user: config.SMTP_MAIL_USERNAME, //generate ethereal user 
        password: config.SMTP_MAIL_PASSWORD, //generate ethereal password
    },
});

export default transporter;