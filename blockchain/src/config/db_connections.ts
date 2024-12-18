import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host:"localhost",
  database:"crypto_authdb_bkp",
  user:"root",
  password:'root',
});

export default connection;
