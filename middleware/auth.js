// auth.js
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // Check X-API-KEY header or authorization header
  const apiKeyHeader = req.header('x-api-key') || (req.header('authorization') || '').replace('Bearer ', '');
  const expected = process.env.API_KEY || 'my-secret-api-key';

  // Only require API key for mutating requests: POST, PUT, DELETE
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (!apiKeyHeader || apiKeyHeader !== expected) {
      return next(new UnauthorizedError('Invalid or missing API key'));
    }
  }
  next();
};