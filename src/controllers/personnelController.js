const Personnel = require('../models/personnel');

/**
 * Personnel Controller
 */
class PersonnelController {
  /**
   * Get all personnel
   */
  static async getAll(req, res) {
    try {
      const personnel = await Personnel.getAll();
      res.json({
        success: true,
        data: personnel,
        count: personnel.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching personnel',
        error: error.message
      });
    }
  }

  /**
   * Get personnel by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const personnel = await Personnel.getById(id);
      
      if (!personnel) {
        return res.status(404).json({
          success: false,
          message: 'Personnel not found'
        });
      }

      res.json({
        success: true,
        data: personnel
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching personnel',
        error: error.message
      });
    }
  }

  /**
   * Search personnel
   */
  static async search(req, res) {
    try {
      const { query, status } = req.query;
      let personnel;

      if (query) {
        personnel = await Personnel.searchByName(query);
      } else if (status) {
        personnel = await Personnel.getByStatus(status);
      } else {
        personnel = await Personnel.getAll();
      }

      res.json({
        success: true,
        data: personnel,
        count: personnel.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching personnel',
        error: error.message
      });
    }
  }

  /**
   * Create new personnel
   */
  static async create(req, res) {
    try {
      const { nip, nama } = req.body;

      // Validate required fields
      if (!nip || !nama) {
        return res.status(400).json({
          success: false,
          message: 'NIP and nama are required'
        });
      }

      // Check if NIP already exists
      const existing = await Personnel.getByNip(nip);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Personnel with this NIP already exists'
        });
      }

      const result = await Personnel.create(req.body);
      const newPersonnel = await Personnel.getById(result.id);

      res.status(201).json({
        success: true,
        message: 'Personnel created successfully',
        data: newPersonnel
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating personnel',
        error: error.message
      });
    }
  }

  /**
   * Update personnel
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nip, nama } = req.body;

      // Check if personnel exists
      const existing = await Personnel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Personnel not found'
        });
      }

      // Validate required fields
      if (!nip || !nama) {
        return res.status(400).json({
          success: false,
          message: 'NIP and nama are required'
        });
      }

      // Check if NIP is being changed and if new NIP already exists
      if (nip !== existing.nip) {
        const nipExists = await Personnel.getByNip(nip);
        if (nipExists) {
          return res.status(409).json({
            success: false,
            message: 'Personnel with this NIP already exists'
          });
        }
      }

      await Personnel.update(id, req.body);
      const updatedPersonnel = await Personnel.getById(id);

      res.json({
        success: true,
        message: 'Personnel updated successfully',
        data: updatedPersonnel
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating personnel',
        error: error.message
      });
    }
  }

  /**
   * Delete personnel
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Check if personnel exists
      const existing = await Personnel.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Personnel not found'
        });
      }

      await Personnel.delete(id);

      res.json({
        success: true,
        message: 'Personnel deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting personnel',
        error: error.message
      });
    }
  }
}

module.exports = PersonnelController;
