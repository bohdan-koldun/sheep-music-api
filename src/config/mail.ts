export default {
    connection: process.env.MAIL_CONNECTION,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
};
