import nodemailer from 'nodemailer';

import { IEnvData } from '../interfaces/IConfig';

// types and interfaces
export interface IEmailProvider {
    sendHtml(to : string, subject : string, html : string, from? : string) : Promise<void>
    sendText(to : string, subject : string, text : string, from? : string) : Promise<void>
}

export class NodemailerEmailProvider implements IEmailProvider {

    private transporter: nodemailer.Transporter;

    constructor(
        private envData : IEnvData,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.envData.emailHost,
            port: Number(this.envData.emailPort),
            secure: this.envData.emailSecure,
            auth: {
                user: this.envData.emailUser,
                pass: this.envData.emailPass,
            }
        });
    }

    async sendHtml(to : string, subject : string, html : string, from : string = this.envData.emailUser): Promise<void> {
        // Verify transporter
        this.transporter.verify((error, success) => {
            if (error) throw new Error("Error with mailer configuration");
        });

        await this.transporter.sendMail({
            from: from,
            to : to,
            subject : subject,
            html : html,
        });
    }

    async sendText(to: string, subject: string, text: string, from: string): Promise<void> {
        // Verify transporter
        this.transporter.verify((error, success) => {
            if (error) throw new Error("Error with mailer configuration");
        });

        await this.transporter.sendMail({
            from: from,
            to : to,
            subject : subject,
            text : text,
        });
    }
}