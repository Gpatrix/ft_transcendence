import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user:  process.env.MAIL_ADRESS,
      pass:  process.env.MAIL_PASSWORD,
    },
});

export default async function sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
        from: `ft_transcendence`,
        to,
        subject,
        text,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }
};