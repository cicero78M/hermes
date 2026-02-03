const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

/**
 * @route   GET /api/users
 * @desc    Get all users or search
 * @query   query - search by name
 * @query   status - filter by status
 * @access  Public
 */
router.get('/', UserController.search);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', UserController.getById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', UserController.create);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Public
 */
router.put('/:id', UserController.update);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Public
 */
router.delete('/:id', UserController.delete);

module.exports = router;
