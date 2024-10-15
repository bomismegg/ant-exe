const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require('../auth/authUtils');
const { Api404Error, BusinessLogicError } = require('../core/error.response');
const EmailService = require('./email.service');
const redisClient = require('../configs/redis.config');

class UserService {

    // Register a new user
    static async registerUser({ name, email, password, role = 'guest' }) {
        // Check if the email already exists
        const existingUser = await User.findOne({ usr_email: email });
        if (existingUser) {
            throw new BusinessLogicError('Email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name: name,      // Add name here
            email: email,
            password: hashedPassword,
            role: role,
            verified: false
        });

        // Generate a unique verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Store the verification token in Redis with an expiration time (e.g., 24 hours)
        await redisClient.set(`verify:${newUser._id}`, verificationToken, { EX: 86400 });

        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&userId=${newUser._id}`;
        const emailService = new EmailService(newUser.email, 'Verify your account', verificationUrl);
        await emailService.sendVerificationEmail(verificationUrl);

        return newUser;
    }

    static async verifyEmail({ token, userId }) {
        // Retrieve the stored token from Redis
        const storedToken = await redisClient.get(`verify:${userId}`);

        // If no token is found or it doesn't match, throw an error
        if (!storedToken || storedToken !== token) {
            throw new BusinessLogicError('Invalid or expired verification token');
        }

        // If the token is valid, update the user to set them as verified
        const user = await User.findByIdAndUpdate(userId, { verified: true }, { new: true });

        // Optionally, delete the token from Redis after successful verification
        await redisClient.del(`verify:${userId}`);

        return user;
    }

    // Login user
    static async loginUser({ email, password }) {
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Api404Error('User not found');
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new BusinessLogicError('Invalid credentials');
        }

        // Create JWT tokens
        const tokens = await createTokenPair({ userId: user._id, role: user.role });

        return tokens;
    }

    // Get user profile
    static async getUserProfile(userId) {
        const user = await User.findById(userId).populate('properties');
        if (!user) throw new Api404Error('User not found');

        return user;
    }

    // Update user profile
    static async updateUserProfile(userId, updateData) {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) throw new Api404Error('User not found');

        return updatedUser;
    }

    static async approveHost(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new BusinessLogicError('User not found');
        }

        if (!user.role.includes('guest')) {
            throw new BusinessLogicError('User must be a guest first');
        }

        // Promote user to host
        user.role.push('host');
        await user.save();

        return user;
    }
}

module.exports = UserService;
