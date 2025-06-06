import amqp, { Channel, Connection } from 'amqplib';

let channel: Channel | null = null;

export const connectRabbitMQ = async (): Promise<void> => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT) || 5672,
            username: 'admin',
            password: 'password',
            vhost: '/'
        });

        channel = await connection.createChannel();
        await channel.assertQueue('email_queue', { durable: true });

        console.log('✅ Connected to RabbitMQ');
        
    } catch (error: any) {
        console.error('❌ Failed to connect to RabbitMQ:', error.message);
        channel = null;
    }
};

export const getChannel = (): Channel | null => channel;