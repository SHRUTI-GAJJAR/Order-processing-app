const Product = require('../models/Product');

// Create Product (Admin Only)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};


// Get All Products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Product
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Update Product (Admin Only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};


// Delete Product (Admin Only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
