import transporter from '../config/transporter.config'
import config from '../config/index';


const mailhelper = async (options) => {
    const message = {
        from: config.SMTP_MAIL_Email, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
        // html: "<b>Hello world?</b>", // html body
    }

    await transporter.sendMail(message);
}