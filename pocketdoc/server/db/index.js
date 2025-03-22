const oracledb = require('oracledb');
require('dotenv').config();

// Enable auto-commit for all queries
oracledb.autoCommit = true;

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
};

// Execute a query and return results
async function execute(sql, binds = {}, options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Set default options if none are provided
    const defaultOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT };

    const result = await connection.execute(sql, binds, { ...defaultOptions, ...options });

    return result;
  } catch (err) {
    console.error('Database Error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

module.exports = { execute, oracledb };
