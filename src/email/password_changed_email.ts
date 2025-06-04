import { email_transporter, sender_email } from "@/lib/nodemailer";

export const password_changed_email = async (name: string, user_email: string) => {

    try {
        await email_transporter.sendMail({
            from: sender_email,
            to: user_email,
            subject: "Your Password Has Been Changed",
            text: `
Hi ${name},

This is a confirmation that your password was successfully changed.

If you did not make this change, please reset your password immediately and contact our support team.

Stay secure,  
Bachatjar.com Team
      `,
        })
        // console.log(`Message sent`, info);
    } catch (error) {
        console.log(`error sent`, error);
    }
};


