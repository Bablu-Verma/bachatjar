import { email_transporter, sender_email } from "@/lib/nodemailer";

export const newsletter_subscribe = async (
  user_email: string,
) => {
  try {
    await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Thank You for Subscribing to Our Newsletter!",
      text: `
Hi,

Thank you for subscribing to the Bachatjar.com newsletter!

You’re now connected with us and will start receiving the latest updates, exclusive offers, and money-saving tips directly to your inbox.

If you did not subscribe, please ignore this email or contact our support team.

Best regards,  
Bachatjar.com Team
      `,
    });
  } catch (error) {
    console.log(`Error sending email`, error);
  }
};
