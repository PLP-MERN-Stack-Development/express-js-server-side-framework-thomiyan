class ValidationError extends Error {
  constructor(message = 'Validation error', errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    this.status = 400;
  }
}

module.exports = ValidationError;