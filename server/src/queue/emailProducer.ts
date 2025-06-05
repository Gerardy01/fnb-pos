import { getChannel } from '../config/rabbitmq';

// types and interfaces
import { ISendEmail } from '../interfaces/INotifications';

export const sendEmailToQueue = async (emailData: ISendEmail) => {
    try {
        const channel = await getChannel();
        if (!channel) throw new Error('Failed to get RabbitMQ channel');
        
        channel.sendToQueue('email_queue', Buffer.from(JSON.stringify(emailData)), {
            persistent: true,
        });
        
    } catch (error) {
        console.error('Error sending email to queue:', error);
    }
};