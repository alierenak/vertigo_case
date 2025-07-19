const { Pool } = require('pg');

// Cloud SQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST, // /cloudsql/CONNECTION_NAME for Cloud SQL
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...(process.env.DB_HOST && process.env.DB_HOST.startsWith('/cloudsql/') ? {} : {
    ssl: { rejectUnauthorized: false }
  })
});

module.exports = pool;