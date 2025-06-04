import { email_transporter, sender_email } from "@/lib/nodemailer";

export const withdrawal_request_confirm = async (user_email: string, amount: number, transactionId: string) => {
  try {
    await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Withdrawal Confirmation",
      text: `
        Dear User,

        Your withdrawal request has been successfully processed.

        Amount: ₹${amount}
        Transaction ID: ${transactionId}

        The funds will be credited to your registered account shortly. If you did not initiate this withdrawal, please contact our support team immediately.

        Thank you for using Bachat Jar.

        Best regards,  
        Bachatjar.com Team
      `,
    });
  } catch (error) {
    console.log(`Error sending confirmation email:`, error);
  }
};
