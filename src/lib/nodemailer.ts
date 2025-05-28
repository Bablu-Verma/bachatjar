import { MailtrapClient } from "mailtrap"


const TOKEN = process.env.email_server_token || '';
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";


export const email_transporter = new MailtrapClient({ token: TOKEN });
export const sender_email = { name: "Mailtrap Test", email: SENDER_EMAIL };

