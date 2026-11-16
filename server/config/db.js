const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  pool: { max: 3 },                       // small - the whole class uses the same server
  options: { encrypt: true, trustServerCertificate: true },
};

// connect ONCE - everyone awaits the same promise
const poolPromise = new sql.ConnectionPool(config).connect();

module.exports = { sql, poolPromise };