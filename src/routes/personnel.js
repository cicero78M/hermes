const express = require('express');
const router = express.Router();
const PersonnelController = require('../controllers/personnelController');

/**
 * @route   GET /api/personnel
 * @desc    Get all personnel or search
 * @query   query - search by name
 * @query   status - filter by status
 * @access  Public
 */
router.get('/', PersonnelController.search);

/**
 * @route   GET /api/personnel/:id
 * @desc    Get personnel by ID
 * @access  Public
 */
router.get('/:id', PersonnelController.getById);

/**
 * @route   POST /api/personnel
 * @desc    Create new personnel
 * @access  Public
 */
router.post('/', PersonnelController.create);

/**
 * @route   PUT /api/personnel/:id
 * @desc    Update personnel
 * @access  Public
 */
router.put('/:id', PersonnelController.update);

/**
 * @route   DELETE /api/personnel/:id
 * @desc    Delete personnel
 * @access  Public
 */
router.delete('/:id', PersonnelController.delete);

module.exports = router;
