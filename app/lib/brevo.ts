"use server"

import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { EmailOptions } from './email';

export async function sendEmail(options: EmailOptions) {
  const apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);
  const sender = {
    name: process.env.EMAIL_FROM_NAME!,
    email: process.env.EMAIL_FROM!,
  };

  const receivers = [
    {
        email: options.to,
        name: options.name,
    },
  ];

  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.subject = options.subject
  sendSmtpEmail.textContent = options.text;
  sendSmtpEmail.sender = sender;
  sendSmtpEmail.to = receivers;

  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then((data) => {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    })
    .catch((error) => {
        console.error(error);
    });

  }
