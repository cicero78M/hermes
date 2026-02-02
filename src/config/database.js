const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hermes_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Get database pool
 * @returns {Pool} PostgreSQL pool instance
 */
function getDatabase() {
  return pool;
}

/**
 * Run a query with parameters (INSERT, UPDATE, DELETE)
 * @param {string} sql SQL query with $1, $2, ... placeholders
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with query results
 */
async function run(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return {
      id: result.rows[0]?.id || null,
      changes: result.rowCount
    };
  } finally {
    client.release();
  }
}

/**
 * Get single row
 * @param {string} sql SQL query with $1, $2, ... placeholders
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with single row
 */
async function get(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

/**
 * Get all rows
 * @param {string} sql SQL query with $1, $2, ... placeholders
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with all rows
 */
async function all(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Execute a query directly (for queries that don't return data)
 * @param {string} sql SQL query
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with query result
 */
async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

/**
 * Close database connection pool
 */
async function close() {
  await pool.end();
  console.log('Database connection pool closed.');
}

module.exports = {
  getDatabase,
  run,
  get,
  all,
  query,
  close
};
