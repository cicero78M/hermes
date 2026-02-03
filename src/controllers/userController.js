const User = require('../models/user');

/**
 * User Controller
 */
class UserController {
  /**
   * Get all users
   */
  static async getAll(req, res) {
    try {
      const users = await User.getAll();
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error.message
      });
    }
  }

  /**
   * Get user by ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error.message
      });
    }
  }

  /**
   * Search users
   */
  static async search(req, res) {
    try {
      const { query, status } = req.query;
      let users;

      if (query) {
        users = await User.searchByName(query);
      } else if (status) {
        users = await User.getByStatus(status);
      } else {
        users = await User.getAll();
      }

      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching users',
        error: error.message
      });
    }
  }

  /**
   * Create new user
   */
  static async create(req, res) {
    try {
      const { uuid, nama } = req.body;

      // Validate required fields
      if (!uuid || !nama) {
        return res.status(400).json({
          success: false,
          message: 'UUID and nama are required'
        });
      }

      // Check if UUID already exists
      const existing = await User.getByUuid(uuid);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'User with this UUID already exists'
        });
      }

      const result = await User.create(req.body);
      const newUser = await User.getById(result.id);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: error.message
      });
    }
  }

  /**
   * Update user
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { uuid, nama } = req.body;

      // Check if user exists
      const existing = await User.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Validate required fields
      if (!uuid || !nama) {
        return res.status(400).json({
          success: false,
          message: 'UUID and nama are required'
        });
      }

      // Check if UUID is being changed and if new UUID already exists
      if (uuid !== existing.uuid) {
        const uuidExists = await User.getByUuid(uuid);
        if (uuidExists) {
          return res.status(409).json({
            success: false,
            message: 'User with this UUID already exists'
          });
        }
      }

      await User.update(id, req.body);
      const updatedUser = await User.getById(id);

      res.json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user',
        error: error.message
      });
    }
  }

  /**
   * Delete user
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Check if user exists
      const existing = await User.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await User.delete(id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
