const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/configs/db.config');
const logger = require('./src/utils/logger');
const swaggerConfig = require('./src/configs/swagger.config');
const i18n = require('i18n');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// MongoDB connection
connectDB(); // This will connect to MongoDB before the server starts

const app = express();
app.use(express.json());

// Set up i18n
i18n.configure({
  locales: ['en', 'vi'],
  directory: __dirname + '/src/locales',
  defaultLocale: 'en'
});
app.use(i18n.init);

// Logger middleware
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.url}`); // Log every incoming request
  next();  // Pass control to the next middleware
});

// Error handler middleware
app.use(errorHandler);

// Swagger setup
swaggerConfig(app);

// Routes
app.use('/api/v1/user', require('./src/routes/user.routes'));
app.use('/api/v1/booking', require('./src/routes/booking.routes'));
app.use('/api/v1/properties', require('./src/routes/property.routes'));
app.use('/api/v1/review', require('./src/routes/review.routes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
