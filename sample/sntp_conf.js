

require('dotenv').config();

module.exports = {
  host: process.env.SMTP_HOST || 'SERVER_HOST_NAME',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'SMTP_USERNAME',
    pass: process.env.SMTP_PASS || 'SMTP_PASSWORD',
  },
  fromEmail: process.env.FROM_EMAIL || 'HEADER_FROM_ADD',
  fromName: process.env.FROM_NAME || 'YAMAGUCHI',
  envelopeFrom: process.env.ENVELOPE_FROM || 'ENVELOPE_FROM_ADD',
  notificationEmail: process.env.NOTIFICATION_EMAIL || 'himace@gmail.com',
};