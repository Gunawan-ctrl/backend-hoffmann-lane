import mysql from 'mysql2';
import { config as configDotenv } from 'dotenv';

configDotenv();

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default dbPool.promise();