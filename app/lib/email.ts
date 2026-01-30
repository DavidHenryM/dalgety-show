import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  name?: string;
}

export function sendEmail(options: EmailOptions): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const email = transporter.sendMail({
    from: process.env.EMAIL_FROM,
    ...options
  }).catch((err) => {
    console.error("Error sending email:", err);
    throw err;
  });
  return email;
}

