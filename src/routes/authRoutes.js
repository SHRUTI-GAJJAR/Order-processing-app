const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');

// Register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    // Optional fields for safe admin creation
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
    body('adminSecret')
      .optional()
      .isString()
      .withMessage('Admin secret must be string'),
  ],
  validateRequest,
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

module.exports = router;
