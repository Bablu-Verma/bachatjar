import { email_transporter, sender_email } from "@/lib/nodemailer";

export const withdrawal_request_verify = async (otp: string, user_email: string) => {
  
  try {
  await email_transporter.sendMail({
    from: sender_email,
    to: user_email,
    subject: "withdrawal Verifaction!",
    text: `
    Your withdrawal verification OTP is! ${otp}

    Please enter this OTP to proceed with your withdrawal request.
    `,
  })
  // console.log(`Message sent`, info);
  } catch (error) {
    console.log(`error sent`, error);
  }
};
