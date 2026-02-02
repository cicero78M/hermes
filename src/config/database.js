const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/personnel.db');

let db = null;

/**
 * Get database connection (singleton pattern)
 * @returns {sqlite3.Database} Database instance
 */
function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to database:', err.message);
        throw err;
      }
      console.log('Connected to the personnel database.');
    });
  }
  return db;
}

/**
 * Run a query with parameters
 * @param {string} sql SQL query
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with query results
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

/**
 * Get single row
 * @param {string} sql SQL query
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with single row
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Get all rows
 * @param {string} sql SQL query
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with all rows
 */
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    database.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Close database connection
 */
function close() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
        db = null;
      }
    });
  }
}

module.exports = {
  getDatabase,
  run,
  get,
  all,
  close
};
