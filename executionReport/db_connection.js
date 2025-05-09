const mysql = require('mysql2');
const { config } = require('./config/config');

const connection = mysql.createConnection({
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password,
});

module.exports = connection;