import express, { Express } from "express";

// Queue
import { connectRabbitMQ } from './config/rabbitmq';
import { consumeEmailQueue } from "./queue/emailConsumer";


const app : Express = express();
const port : number = Number(process.env.CONSUMER_PORT) || 80;
const host : string = process.env.CONSUMER_HOST || '0.0.0.0';


// Queue Consumer runtime
(async () => {
    await connectRabbitMQ();
    await consumeEmailQueue();

    app.listen(port, host, () => {
        console.log(`[server]: Consumer server is running at http://${host}:${port}`);
    });
})();