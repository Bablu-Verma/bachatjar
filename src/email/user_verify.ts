import { email_transporter, sender_email } from "@/lib/nodemailer";

export const user_verify_email = async (otp: string, user_email: string) => {
  
  try {
   const info = await email_transporter.send({
    from: sender_email,
    to: [{ email: user_email }],
    subject: "Signup Verifaction!",
    text: `
    Your verifaction otp is! ${otp}
    `,
  })
  console.log(`Message sent`, info);
  } catch (error) {
    console.log(`error sent`, error);
  }
};
