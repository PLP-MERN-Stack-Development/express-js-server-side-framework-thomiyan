// validate.js
const ValidationError = require('../errors/ValidationError');

module.exports = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name must be a string with at least 2 characters');
  }
  if (typeof description !== 'string' || description.trim().length < 5) {
    errors.push('description must be a string with at least 5 characters');
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    errors.push('price must be a non-negative number');
  }
  if (typeof category !== 'string' || category.trim().length === 0) {
    errors.push('category must be a non-empty string');
  }
  if (typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean');
  }

  if (errors.length) {
    return next(new ValidationError('Invalid product data', errors));
  }
  next();
};