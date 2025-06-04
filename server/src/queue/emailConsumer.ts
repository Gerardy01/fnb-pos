import { getChannel } from '../config/rabbitmq';

// services
import { notificationService } from '../services';

// types and interfaces
import { ISendEmail } from '../interfaces/INotifications';

export const consumeEmailQueue = async () => {
    const channel = getChannel();

    channel.consume('email_queue', async (msg) => {
        if (msg === null) return;

        const emailData : ISendEmail = JSON.parse(msg.content.toString());

        try {
            await notificationService.sendEmail(
                emailData.to,
                emailData.subject,
                emailData.body,
                emailData.type
            );
            
            channel.ack(msg);
        } catch (err) {
            console.error('Email sending failed:', err);
            channel.nack(msg, false, false);
        }
    });
};