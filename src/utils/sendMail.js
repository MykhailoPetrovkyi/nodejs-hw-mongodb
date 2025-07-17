import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

let transporter;

const configureTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: getEnvVar('SMTP_HOST'),
    port: Number(getEnvVar('SMTP_PORT')),
    auth: {
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASSWORD'),
    },
  });

  return transporter;
};

export const sendMail = async (options) => {
  const mailer = configureTransporter();
  return await mailer.sendMail(options);
};
