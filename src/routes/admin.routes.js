/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API for admin tasks such as approving host requests
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authentication, authorizeRoles } = require('../auth/authUtils');

// Admin routes (protected by admin role)
router.use(authentication);
router.use(authorizeRoles('admin'));

/**
 * @swagger
 * /admin/approve-host:
 *   post:
 *     summary: Approve a request for a user to become a host
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Host request approved successfully
 *       403:
 *         description: Only admins can approve host requests
 */
router.post('/approve-host', adminController.approveHostRequest);

/**
 * @swagger
 * /admin/pending-host-requests:
 *   get:
 *     summary: Fetch pending host requests from RabbitMQ
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending host requests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   requestTime:
 *                     type: string
 *                     example: "2024-10-10T12:34:56.789Z"
 *       403:
 *         description: Only admins can fetch pending host requests
 */
router.get('/pending-host-requests', adminController.fetchPendingHostRequests);

module.exports = router;
