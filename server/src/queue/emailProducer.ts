import { getChannel } from '../config/rabbitmq';

// types and interfaces
import { ISendEmail } from '../interfaces/INotifications';

export const sendEmailToQueue = async (emailData: ISendEmail) => {
    const channel = getChannel();
    
    channel.sendToQueue('email_queue', Buffer.from(JSON.stringify(emailData)), {
        persistent: true,
    });
};