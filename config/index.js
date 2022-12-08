
// custom dotenv  created so that dont need to write process.env.---- 
import dotenv from "dotenv";

dotenv.config();

const config = {
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRY : process.env.JWT_EXPIRY || "30d",
    MONGODB_URL : process.env.MONGODB_URL,
    PORT : process.env.PORT,
    SMTP_MAIL_HOST :process.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT :process.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME :process.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD :process.SMTP_MAIL_PASSWORD,
}
export default config