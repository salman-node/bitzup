import mysql from "mysql";
import dotenv from "dotenv";
import { promisify } from "util";

dotenv.config();

// Load environment variables
const host = process.env.DB_HOST_SERVER;
const user = process.env.DB_USER_SERVER;
const password = process.env.DB_PASSWORD_SERVER;
const databaseName = process.env.DB_NAME_SERVER;

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 50,  // Number of connections to allow in the pool
  multipleStatements: true,
  host: host,
  user: user,
  password: password,
  database: databaseName,
});

// Check if the pool is working correctly
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to DB pool Server:", err);
  } else {
    console.log("DB Pool Server Connected");
    connection.release(); // Release the connection back to the pool
  }
});

// Promisify the pool.query method
pool.query = promisify(pool.query);

// Promisify pool.getConnection
pool.getConnection = promisify(pool.getConnection);

// Export the pool for use in other modules
export default pool;
