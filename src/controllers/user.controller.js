const userService = require('../services/user.service');
const catchAsync = require('../helpers/catch.async');
const { OK } = require('../core/success.response');

class UserController {
    
    // Register a new user
    registerUser = catchAsync(async (req, res) => {
        const user = await userService.registerUser(req.body);
        OK(res, 'User registered successfully', user);
    });

    // User login
    loginUser = catchAsync(async (req, res) => {
        const tokens = await userService.loginUser(req.body);
        OK(res, 'Login successful', tokens);
    });

    // Google OAuth login
    googleLogin = catchAsync(async (req, res) => {
        const tokens = await userService.googleLogin(req.body);
        OK(res, 'Google login successful', tokens);
    });

    // Verify email
    verifyEmail = catchAsync(async (req, res) => {
        const user = await userService.verifyEmail(req.body);
        OK(res, 'Email verified successfully', user);
    });

    // Get user profile
    getUserProfile = catchAsync(async (req, res) => {
        const user = await userService.getUserProfile(req.user.userId);
        OK(res, 'User profile fetched successfully', user);
    });

    // Update user profile
    updateUserProfile = catchAsync(async (req, res) => {
        const user = await userService.updateUserProfile(req.user.userId, req.body);
        OK(res, 'User profile updated successfully', user);
    });

    async requestHostRole(req, res) {
        try {
            const { userId } = req.user;
            const user = await User.findById(userId);

            if (user.role === 'host') {
                throw new BusinessLogicError('You are already a host.');
            }

            // Send request to admin queue
            await rabbitMQService.sendToQueue('adminQueue', {
                userId,
                requestType: 'hostRole',
                email: user.email
            });

            res.status(200).json({
                message: 'Your request to become a host has been sent for approval.',
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new UserController();
