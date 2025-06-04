import { email_transporter, sender_email } from "@/lib/nodemailer";

export const upi_verify_email = async (otp: string, user_email: string) => {
  
  try {
  await email_transporter.sendMail({
  from: sender_email,
  to: user_email,
  subject: "UPI Verification Code",
  text: `
    Dear User,

    Thank you for initiating the UPI addition process.

    Your One-Time Password (OTP) for UPI verification is: ${otp}

    Please use this OTP to complete your verification. Do not share this code with anyone for security reasons.

    Best regards,  
    Bachatjar.com
      `
});
  // console.log(`Message sent`, info);
  } catch (error) {
    console.log(`error sent`, error);
  }
};
