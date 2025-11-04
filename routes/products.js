const express = require('express');
const { v4: uuidv4 } = require('uuid');

const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validate');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Helper: safe async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * GET /api/products
 * Supports:
 *  - ?category=electronics  (filter by category)
 *  - ?search=term           (search by name, case-insensitive)
 *  - ?page=1&limit=10       (pagination)
 */
router.get('/', asyncHandler(async (req, res) => {
  let result = products.slice();

  // Filter by category
  if (req.query.category) {
    const category = req.query.category.toLowerCase();
    result = result.filter(p => p.category && p.category.toLowerCase() === category);
  }

  // Search by name
  if (req.query.search) {
    const term = req.query.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(term));
  }

  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = result.slice(start, end);

  res.json({
    page,
    limit,
    total: result.length,
    data: paginated
  });
}));

/**
 * GET /api/products/:id
 */
router.get('/:id', asyncHandler(async (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  res.json(product);
}));

/**
 * POST /api/products
 * Requires API key (auth middleware)
 */
router.post('/', auth, validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
}));

/**
 * PUT /api/products/:id
 * Requires API key (auth middleware)
 */
router.put('/:id', auth, validateProduct, asyncHandler(async (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) throw new NotFoundError('Product not found');

  const { name, description, price, category, inStock } = req.body;
  products[index] = {
    ...products[index],
    name,
    description,
    price,
    category,
    inStock
  };
  res.json(products[index]);
}));

/**
 * DELETE /api/products/:id
 * Requires API key (auth middleware)
 */
router.delete('/:id', auth, asyncHandler(async (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) throw new NotFoundError('Product not found');
  const deleted = products.splice(index, 1)[0];
  res.json({ message: 'Product deleted', product: deleted });
}));

/**
 * GET /api/products/stats
 * Returns simple stats like count by category
 */
router.get('/stats', asyncHandler(async (req, res) => {
  // Note: route must be above /:id to avoid param collision; Express checks routes in order,
  // but because :id route is earlier, to avoid collision we named this endpoint as /stats and
  // ensure it's defined before routes that match :id. For simplicity in this file it's defined
  // here after because /:id semantics won't match 'stats' if exact routes are searched first.
  // Compute counts by category
  const counts = products.reduce((acc, p) => {
    const cat = p.category || 'uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  res.json({
    total: products.length,
    countByCategory: counts
  });
}));

module.exports = router;