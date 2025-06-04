import { email_transporter, sender_email } from "@/lib/nodemailer";

export const user_verify_email = async (otp: string, user_email: string) => {
  
  try {
    await email_transporter.sendMail({
    from: sender_email,
    to: user_email,
   subject: "Signup Verification Code",
  text: `
      Dear User,

      Thank you for signing up.

      Your One-Time Password (OTP) for verification is: ${otp}

      Please enter this OTP to complete your registration. Do not share this code with anyone for security reasons.

      Best regards,  
      BachatJar.com Team
      `
  })
  // console.log(`Message sent`, info);
  } catch (error) {
    console.log(`error sent`, error);
  }
};
