const { verifyToken } = require('../auth/authUtils');
const { Api401Error } = require('../core/error.response');

const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the request header
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new Api401Error('You are not logged in! Please log in to access this route.');
        }

        // Verify token
        const decoded = await verifyToken(token);
        req.user = decoded; // Attach the decoded user data to the request

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    protectRoute,
};
