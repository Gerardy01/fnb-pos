import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME?.toString() || "",
    process.env.DB_USER?.toString() || "",
    process.env.DB_PASSWORD?.toString() || "",
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        logging: false
    }
);

export default sequelize;