const JWT = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Middleware for JWT authentication
const authentication = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        JWT.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Token is not valid' });
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Role-based authorization
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied: You do not have the correct role' });
        }
        next();
    };
};

// Create access token
const createAccessToken = (payload) => {
    return JWT.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Create token pair (both access and refresh tokens)
const createTokenPair = (payload) => {
    const accessToken = createAccessToken(payload);
    const refreshToken = JWT.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
};

module.exports = {
    authentication, 
    authorizeRoles,  // New method for role-based authorization
    createTokenPair
};
