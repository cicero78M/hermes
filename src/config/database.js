const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database/personnel.db');

/**
 * Get database connection
 * @returns {sqlite3.Database} Database instance
 */
function getDatabase() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      throw err;
    }
    console.log('Connected to the personnel database.');
  });
}

/**
 * Run a query with parameters
 * @param {string} sql SQL query
 * @param {Array} params Query parameters
 * @returns {Promise} Promise with query results
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
      db.close();
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
    const db = getDatabase();
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
      db.close();
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
    const db = getDatabase();
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
}

module.exports = {
  getDatabase,
  run,
  get,
  all
};
