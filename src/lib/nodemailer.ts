import nodemailer from 'nodemailer';




export const email_transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});


export const sender_email = `"Bachatjar" help@bachatjar.com`

