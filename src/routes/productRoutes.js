const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
// const multer = require('multer');
// const path = require('path');

const upload = require('../middlewares/uploadMiddleware'); // ✅ New Multer Middleware

// Validation middleware
const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  res.status(400).json({ success: false, errors: errors.array() });
};

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
  ]),
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('image'),   // ✅ add this
  updateProduct
);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
