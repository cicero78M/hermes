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
    const sql = 'SELECT * FROM personnel WHERE id = $1';
    return await db.get(sql, [id]);
  }

  /**
   * Get personnel by NIP
   * @param {string} nip Personnel NIP
   * @returns {Promise<Object>} Personnel data
   */
  static async getByNip(nip) {
    const sql = 'SELECT * FROM personnel WHERE nip = $1';
    return await db.get(sql, [nip]);
  }

  /**
   * Search personnel by name
   * @param {string} name Personnel name
   * @returns {Promise<Array>} List of personnel matching the name
   */
  static async searchByName(name) {
    const sql = 'SELECT * FROM personnel WHERE nama ILIKE $1 ORDER BY nama ASC';
    return await db.all(sql, [`%${name}%`]);
  }

  /**
   * Get personnel by status
   * @param {string} status Personnel status (aktif/non-aktif)
   * @returns {Promise<Array>} List of personnel with the specified status
   */
  static async getByStatus(status) {
    const sql = 'SELECT * FROM personnel WHERE status = $1 ORDER BY nama ASC';
    return await db.all(sql, [status]);
  }

  /**
   * Create new personnel
   * @param {Object} data Personnel data
   * @returns {Promise<Object>} Created personnel ID
   */
  static async create(data) {
    const sql = `
      INSERT INTO personnel (
        nip, nama, jabatan, unit_kerja, email, telepon, 
        alamat, tanggal_lahir, tanggal_masuk, status, additional_data
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `;
    
    // Prepare additional_data as JSONB
    const additionalData = data.additional_data || {};
    
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
      JSON.stringify(additionalData)
    ];
    
    const result = await db.get(sql, params);
    return { id: result.id, changes: 1 };
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
      SET nip = $1,
          nama = $2,
          jabatan = $3,
          unit_kerja = $4,
          email = $5,
          telepon = $6,
          alamat = $7,
          tanggal_lahir = $8,
          tanggal_masuk = $9,
          status = $10,
          additional_data = $11
      WHERE id = $12
    `;
    
    // Prepare additional_data as JSONB
    const additionalData = data.additional_data || {};
    
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
      JSON.stringify(additionalData),
      id
    ];
    
    await db.query(sql, params);
    return { changes: 1 };
  }

  /**
   * Delete personnel
   * @param {number} id Personnel ID
   * @returns {Promise<Object>} Delete result
   */
  static async delete(id) {
    const sql = 'DELETE FROM personnel WHERE id = $1';
    await db.query(sql, [id]);
    return { changes: 1 };
  }

  /**
   * Search personnel by key-value in additional_data
   * @param {string} key Key in additional_data JSONB field
   * @param {any} value Value to search for
   * @returns {Promise<Array>} List of personnel matching the criteria
   */
  static async searchByAdditionalData(key, value) {
    const sql = `
      SELECT * FROM personnel 
      WHERE additional_data->$1 = $2
      ORDER BY nama ASC
    `;
    return await db.all(sql, [key, JSON.stringify(value)]);
  }

  /**
   * Update specific key-value in additional_data
   * @param {number} id Personnel ID
   * @param {string} key Key to update
   * @param {any} value New value
   * @returns {Promise<Object>} Update result
   */
  static async updateAdditionalDataKey(id, key, value) {
    const sql = `
      UPDATE personnel
      SET additional_data = jsonb_set(additional_data, $1, $2)
      WHERE id = $3
    `;
    await db.query(sql, [`{${key}}`, JSON.stringify(value), id]);
    return { changes: 1 };
  }
}

module.exports = Personnel;
