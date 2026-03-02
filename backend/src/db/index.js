const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Run a single query against the pool.
 * @param {string} text   - SQL query string
 * @param {Array}  params - Parameterised values
 */
const query = (text, params) => pool.query(text, params);

/**
 * Test that the database is reachable.
 * Used by the /health endpoint.
 */
const testConnection = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return true;
  } finally {
    client.release();
  }
};

module.exports = { query, pool, testConnection };
