// server.js - Completed Express server for Week 2 assignment

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(bodyParser.json());
app.use(logger);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see and manage products.');
});

// Routes (auth middleware applied to mutating routes via router)
app.use('/api/products', productsRouter);

// Global error handler (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export for tests
module.exports = app;