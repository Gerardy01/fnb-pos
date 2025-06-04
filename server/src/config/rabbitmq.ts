import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
    channel = await connection.createChannel();
    
    await channel.assertQueue('email_queue', { durable: true });
};

export const getChannel = () => channel;