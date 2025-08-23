import { injectable } from "@loopback/context";
import nodemailer from "nodemailer";

@injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    
    constructor() {
        this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USERNAME || 'default_username',
            pass: process.env.SMTP_PASSWORD || 'default_password',
        },
        });
    }

    async sendMail(to: string, subject: string, text: string): Promise<void> {
        if (!to) {
            throw new Error('Recipient email address is required');
        }
        const mailOptions = {
            from: process.env.SMTP_FROM || '',
            to,
            subject,
            text,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
