/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authentication, authorizeRoles } = require('../auth/authUtils');

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Bad request
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', userController.loginUser);

/**
 * @swagger
 * /user/google-login:
 *   post:
 *     summary: Login with Google OAuth
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged in with Google OAuth successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: OAuth failure
 */
router.post('/google-login', userController.googleLogin);

/**
 * @swagger
 * /user/verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "verification_token"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Verification failed
 */
router.post('/verify-email', userController.verifyEmail);

// Protected routes
router.use(authentication); // Apply authentication middleware

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 role:
 *                   type: string
 *                   example: "guest"
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authorizeRoles('guest', 'host', 'admin'), userController.getUserProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.put('/profile', authorizeRoles('guest', 'host', 'admin'), userController.updateUserProfile);

/**
 * @swagger
 * /user/request-host:
 *   post:
 *     summary: Request to become a host
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Host request sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/request-host', authorizeRoles('guest'), userController.requestHostRole);

module.exports = router;
