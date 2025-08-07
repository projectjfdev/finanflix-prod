import nodemailer from 'nodemailer';
const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

export const smtpTransportGmail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const smtpTransportHostinger = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});
