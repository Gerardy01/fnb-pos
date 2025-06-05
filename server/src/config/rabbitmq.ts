import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
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
};

export const getChannel = () => channel;