import express, { Express } from "express";
import dotenv from "dotenv";

// api routes
import api from "./routes";

dotenv.config();


const app : Express = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());


app.use("/api", api);
app.use("*", (req, res) => res.status(404).send("NO API ROUTES"));


// run
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
