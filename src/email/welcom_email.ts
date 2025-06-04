import { email_transporter, sender_email } from "@/lib/nodemailer";

export const Welcome_email = async (name: string, user_email: string) => {
  
  try {
    await email_transporter.sendMail({
    from: sender_email,
    to: user_email,
    subject: "Welcome to Bachat Jar!",
    text: `
        Hi ${name},

        Welcome to Bachat Jar!

        We're excited to have you on board. Start your journey towards smarter saving and better financial habits today.

        If you have any questions or need help getting started, feel free to reach out to our support team.

        Happy Saving!  
        — The Bachat Jar Team
        `,
  })
  // console.log(`Message sent`, info);
  } catch (error) {
    console.log(`error sent`, error);
  }
};
