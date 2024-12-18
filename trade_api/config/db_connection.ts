import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.host,
  database: process.env.database,
  user: process.env.user,
  password: process.env.password,
});

export default connection;