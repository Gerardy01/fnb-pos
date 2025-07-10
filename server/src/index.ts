import express, { Express } from "express";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from 'cors';

// Queue
import { connectRabbitMQ } from './config/rabbitmq';

// api routes
import api from "./routes";

dotenv.config();


const app : Express = express();
const port : number = Number(process.env.PORT) || 80;
const host : string = process.env.HOST || '0.0.0.0'; ;
const client_url : string = process.env.CLIENT_URL || ""

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [client_url], // add another url to allow more
    credentials: true,
}));


app.use("/api", api);
app.use("*", (req, res) => res.status(404).send("NO API ROUTES"));


// run
(async () => {
    await connectRabbitMQ();

    app.listen(port, host, () => {
        console.log(`[server]: Server is running at http://${host}:${port}`);
    });
})();
