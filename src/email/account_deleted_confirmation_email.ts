import { email_transporter, sender_email } from "@/lib/nodemailer";

export const account_deletion_request_email = async (name: string, user_email: string) => {

    try {
        await email_transporter.sendMail({
            from: sender_email,
            to: user_email,
            subject: "Your Account Has Been Deleted",
            text: `
           Hi ${name},

Your Bachat Jar account has been successfully deleted.

We're sorry to see you go. If this was a mistake or you’d like to return, feel free to sign up again anytime.

Thank you for being a part of Bachat Jar.

Best wishes,  
Bachatjar.com Team
      `,

        })
        // console.log(`Message sent`, info);
    } catch (error) {
        console.log(`error sent`, error);
    }
};


