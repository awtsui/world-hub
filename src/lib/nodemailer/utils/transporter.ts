import nodemailer, { Transporter } from 'nodemailer';

const { NODEMAILER_EMAIL, NODEMAILER_EMAIL_PASS } = process.env;
if (!NODEMAILER_EMAIL) throw new Error('NODEMAILER_EMAIL not defined');
if (!NODEMAILER_EMAIL_PASS) throw new Error('NODEMAILER_EMAIL_PASS not defined');

let transporter: Transporter | null;

export const mailOptions = {
  from: NODEMAILER_EMAIL,
  to: NODEMAILER_EMAIL,
};

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_EMAIL_PASS,
      },
    });
  }
  return transporter;
}
