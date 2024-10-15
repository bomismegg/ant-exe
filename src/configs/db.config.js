const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming you have a logger utility

const connectDB = async () => {
    try {
        // Connect to MongoDB using Mongoose
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });

        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
