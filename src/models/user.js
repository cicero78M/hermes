const db = require('../config/database');

/**
 * User Model
 */
class User {
  /**
   * Get all users
   * @returns {Promise<Array>} List of all users
   */
  static async getAll() {
    const sql = 'SELECT * FROM users ORDER BY nama ASC';
    return await db.all(sql);
  }

  /**
   * Get user by ID
   * @param {number} id User ID
   * @returns {Promise<Object>} User data
   */
  static async getById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1';
    return await db.get(sql, [id]);
  }

  /**
   * Get user by UUID
   * @param {string} uuid User UUID
   * @returns {Promise<Object>} User data
   */
  static async getByUuid(uuid) {
    const sql = 'SELECT * FROM users WHERE uuid = $1';
    return await db.get(sql, [uuid]);
  }

  /**
   * Search users by name
   * @param {string} name User name
   * @returns {Promise<Array>} List of users matching the name
   */
  static async searchByName(name) {
    const sql = 'SELECT * FROM users WHERE nama ILIKE $1 ORDER BY nama ASC';
    return await db.all(sql, [`%${name}%`]);
  }

  /**
   * Get users by status
   * @param {string} status User status (aktif/non-aktif)
   * @returns {Promise<Array>} List of users with the specified status
   */
  static async getByStatus(status) {
    const sql = 'SELECT * FROM users WHERE status = $1 ORDER BY nama ASC';
    return await db.all(sql, [status]);
  }

  /**
   * Create new user
   * @param {Object} data User data
   * @returns {Promise<Object>} Created user ID
   */
  static async create(data) {
    const sql = `
      INSERT INTO users (
        uuid, nama, jabatan, unit_kerja, email, telepon, 
        status, pangkat, rayon, ig_uname, fb_uname, tt_uname, x_uname, yt_uname
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;
    
    const params = [
      data.uuid,
      data.nama,
      data.jabatan || null,
      data.unit_kerja || null,
      data.email || null,
      data.telepon || null,
      data.status || 'aktif',
      data.pangkat || null,
      data.rayon || null,
      data.ig_uname || null,
      data.fb_uname || null,
      data.tt_uname || null,
      data.x_uname || null,
      data.yt_uname || null
    ];
    
    const result = await db.get(sql, params);
    return { id: result.id, changes: 1 };
  }

  /**
   * Update user
   * @param {number} id User ID
   * @param {Object} data User data to update
   * @returns {Promise<Object>} Update result
   */
  static async update(id, data) {
    const sql = `
      UPDATE users
      SET uuid = $1,
          nama = $2,
          jabatan = $3,
          unit_kerja = $4,
          email = $5,
          telepon = $6,
          status = $7,
          pangkat = $8,
          rayon = $9,
          ig_uname = $10,
          fb_uname = $11,
          tt_uname = $12,
          x_uname = $13,
          yt_uname = $14
      WHERE id = $15
    `;
    
    const params = [
      data.uuid,
      data.nama,
      data.jabatan || null,
      data.unit_kerja || null,
      data.email || null,
      data.telepon || null,
      data.status || 'aktif',
      data.pangkat || null,
      data.rayon || null,
      data.ig_uname || null,
      data.fb_uname || null,
      data.tt_uname || null,
      data.x_uname || null,
      data.yt_uname || null,
      id
    ];
    
    await db.query(sql, params);
    return { changes: 1 };
  }

  /**
   * Delete user
   * @param {number} id User ID
   * @returns {Promise<Object>} Delete result
   */
  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = $1';
    await db.query(sql, [id]);
    return { changes: 1 };
  }
}

module.exports = User;
