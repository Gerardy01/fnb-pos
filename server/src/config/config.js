require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER?.toString() || "",
    password: process.env.DB_PASSWORD?.toString() || "",
    database: process.env.DB_NAME.toString() || "",
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USER?.toString() || "",
    password: process.env.DB_PASSWORD?.toString() || "",
    database: process.env.DB_NAME.toString() || "",
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER?.toString() || "",
    password: process.env.DB_PASSWORD?.toString() || "",
    database: process.env.DB_NAME.toString() || "",
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
}
