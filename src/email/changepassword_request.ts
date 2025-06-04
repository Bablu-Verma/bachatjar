import { email_transporter, sender_email } from "@/lib/nodemailer";

export const changepassword_request_email = async (
  user_email: string,
  name: string,
  jwt: string
) => {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${jwt}`;

    await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Reset Password Link",
     text: `
        Hi ${name},

        We received a request to reset your password.

        To proceed, please click the link below:
        ${resetLink}

        If you did not request a password reset, please ignore this email or contact our support team.

        Best regards,  
        Bachatjar.com Support Team
        `
    });
    // console.log(`Message sent`, info);
  } catch (error) {
    console.log(`Error sending email`, error);
  }
};
