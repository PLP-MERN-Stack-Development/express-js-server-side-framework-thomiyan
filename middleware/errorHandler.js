// errorHandler.js
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (err, req, res, next) => {
  // Default to 500
  let status = 500;
  let payload = {
    message: 'An unexpected error occurred'
  };

  if (err instanceof ValidationError) {
    status = 400;
    payload = { message: err.message, errors: err.errors || [] };
  } else if (err instanceof NotFoundError) {
    status = 404;
    payload = { message: err.message };
  } else if (err instanceof UnauthorizedError) {
    status = 401;
    payload = { message: err.message };
  } else if (err.status && err.message) {
    // Generic custom error
    status = err.status;
    payload = { message: err.message };
  } else {
    // Log full error server-side
    console.error(err);
  }

  res.status(status).json(payload);
};