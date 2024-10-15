// src/middleware/errorHandler.js

const { ApiError } = require('../core/error.response');

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        err.statusCode = 400;  // Bad Request
        err.message = Object.values(err.errors)
            .map(val => val.message)  // Extract validation messages
            .join(', ');
    }

    // Handle Mongoose CastError (e.g., invalid ObjectId)
    if (err.name === 'CastError') {
        err.statusCode = 400;  // Bad Request
        err.message = `Invalid ${err.path}: ${err.value}.`;
    }

    // Fallback for other errors (handle other types of errors here)
    if (!(err instanceof ApiError)) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
        err.message = err.message || 'Internal Server Error';
    }

    // Send JSON error response
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,  // Only show stack in dev mode
    });
};

module.exports = errorHandler;
