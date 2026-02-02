const db = require('../config/database');

/**
 * Personnel Model
 */
class Personnel {
  /**
   * Get all personnel
   * @returns {Promise<Array>} List of all personnel
   */
  static async getAll() {
    const sql = 'SELECT * FROM personnel ORDER BY nama ASC';
    return await db.all(sql);
  }

  /**
   * Get personnel by ID
   * @param {number} id Personnel ID
   * @returns {Promise<Object>} Personnel data
   */
  static async getById(id) {
    const sql = 'SELECT * FROM personnel WHERE id = ?';
    return await db.get(sql, [id]);
  }

  /**
   * Get personnel by NIP
   * @param {string} nip Personnel NIP
   * @returns {Promise<Object>} Personnel data
   */
  static async getByNip(nip) {
    const sql = 'SELECT * FROM personnel WHERE nip = ?';
    return await db.get(sql, [nip]);
  }

  /**
   * Search personnel by name
   * @param {string} name Personnel name
   * @returns {Promise<Array>} List of personnel matching the name
   */
  static async searchByName(name) {
    const sql = 'SELECT * FROM personnel WHERE nama LIKE ? ORDER BY nama ASC';
    return await db.all(sql, [`%${name}%`]);
  }

  /**
   * Get personnel by status
   * @param {string} status Personnel status (aktif/non-aktif)
   * @returns {Promise<Array>} List of personnel with the specified status
   */
  static async getByStatus(status) {
    const sql = 'SELECT * FROM personnel WHERE status = ? ORDER BY nama ASC';
    return await db.all(sql, [status]);
  }

  /**
   * Create new personnel
   * @param {Object} data Personnel data
   * @returns {Promise<Object>} Created personnel ID
   */
  static async create(data) {
    const sql = `
      INSERT INTO personnel (nip, nama, jabatan, unit_kerja, email, telepon, alamat, tanggal_lahir, tanggal_masuk, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.nip,
      data.nama,
      data.jabatan || null,
      data.unit_kerja || null,
      data.email || null,
      data.telepon || null,
      data.alamat || null,
      data.tanggal_lahir || null,
      data.tanggal_masuk || null,
      data.status || 'aktif'
    ];
    return await db.run(sql, params);
  }

  /**
   * Update personnel
   * @param {number} id Personnel ID
   * @param {Object} data Personnel data to update
   * @returns {Promise<Object>} Update result
   */
  static async update(id, data) {
    const sql = `
      UPDATE personnel
      SET nip = ?,
          nama = ?,
          jabatan = ?,
          unit_kerja = ?,
          email = ?,
          telepon = ?,
          alamat = ?,
          tanggal_lahir = ?,
          tanggal_masuk = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      data.nip,
      data.nama,
      data.jabatan || null,
      data.unit_kerja || null,
      data.email || null,
      data.telepon || null,
      data.alamat || null,
      data.tanggal_lahir || null,
      data.tanggal_masuk || null,
      data.status || 'aktif',
      id
    ];
    return await db.run(sql, params);
  }

  /**
   * Delete personnel
   * @param {number} id Personnel ID
   * @returns {Promise<Object>} Delete result
   */
  static async delete(id) {
    const sql = 'DELETE FROM personnel WHERE id = ?';
    return await db.run(sql, [id]);
  }
}

module.exports = Personnel;
