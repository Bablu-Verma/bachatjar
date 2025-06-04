import { email_transporter, sender_email } from "@/lib/nodemailer";

export const withdrawal_request_verify = async (otp: string, user_email: string) => {
  
  try {
  await email_transporter.sendMail({
    from: sender_email,
    to: user_email,
    subject: "Withdrawal Verification Code",
    text: `
    Dear User,

    Your One-Time Password (OTP) for withdrawal verification is: ${otp}

    Please enter this OTP to proceed with your withdrawal request. For your security, do not share this code with anyone.

    Best regards,  
    Bachatjar.com Team
    `,
  })

  } catch (error) {
    console.log(`error sent`, error);
  }
};
