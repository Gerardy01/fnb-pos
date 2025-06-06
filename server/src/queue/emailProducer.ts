import { getChannel } from '../config/rabbitmq';

// types and interfaces
import { ISendEmail } from '../interfaces/INotifications';

export const sendEmailToQueue = async (emailData: ISendEmail) => {
    const channel = await getChannel();
    if (!channel) {
        console.log('Failed to get RabbitMQ channel');
        return;
    }
    
    channel.sendToQueue('email_queue', Buffer.from(JSON.stringify(emailData)), {
        persistent: true,
    });
};