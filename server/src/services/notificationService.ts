
import { SendEmailTypeEnum } from "../utility/enums";

// types and interfaces
import { IEmailProvider } from "../providers/emailProvider";
export interface INotificationService {
    sendEmail(to : string, subject : string, body : string, type : string) : Promise<void>
}


export class NotificationService implements INotificationService {
    constructor (
        private emailProvider : IEmailProvider
    ) {}

    async sendEmail(to: string, subject: string, body: string, type : string): Promise<void> {
        
        if (type === SendEmailTypeEnum.TEXT) {
            await this.emailProvider.sendText(
                to,
                subject,
                body
            );

            return;
        }
        
        if (type == SendEmailTypeEnum.HTML) {
            await this.emailProvider.sendHtml(
                to,
                subject,
                body
            );

            return;
        }

        console.log("Wrong email contnt type")
    }
}