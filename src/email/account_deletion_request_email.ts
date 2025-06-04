import { email_transporter, sender_email } from "@/lib/nodemailer";

export const account_deletion_request_email = async (name: string, user_email: string) => {

    try {
        await email_transporter.sendMail({
            from: sender_email,
            to: user_email,
            subject: "Confirm Account Deletion",
            text: `
            Hi ${name},

            We received a request to delete your Bachat Jar account.

            If you made this request, please confirm through the app or reply if needed. Once deleted, your data cannot be recovered.

            If you did not make this request, please contact our support team immediately.

            Regards,  
            Bachatjar.com Team
                `,

        })
        // console.log(`Message sent`, info);
    } catch (error) {
        console.log(`error sent`, error);
    }
};


