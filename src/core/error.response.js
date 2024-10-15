// src/core/error.response.js

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Capture the stack trace, excluding the constructor itself
        Error.captureStackTrace(this, this.constructor);
    }
}

// 404 Not Found Error
class Api404Error extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

// Business Logic Error
class BusinessLogicError extends ApiError {
    constructor(message = 'Business logic error occurred') {
        super(message, 400);  // Defaulting to 400 Bad Request
    }
}

module.exports = {
    Api404Error,
    BusinessLogicError,
    ApiError,
};
