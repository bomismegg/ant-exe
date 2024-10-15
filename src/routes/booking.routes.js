/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API for managing bookings
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authentication, authorizeRoles } = require('../auth/authUtils');

// Protected routes (Require JWT authentication)
router.use(authentication);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-10"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-15"
 *               guestCount:
 *                 type: number
 *                 example: 2
 *               paymentMethod:
 *                 type: string
 *                 example: "credit_card"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       403:
 *         description: Only guests can create bookings
 */
router.post('/', authorizeRoles('guest', 'admin'), bookingController.createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings for a user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of bookings for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   property:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-10"
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     example: "2024-10-15"
 *                   guestCount:
 *                     type: number
 *                     example: 2
 *       403:
 *         description: Only guests and admins can view bookings
 */
router.get('/', authorizeRoles('guest', 'admin'), bookingController.getBookingsByUser);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a specific booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 property:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-10"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-10-15"
 *                 guestCount:
 *                   type: number
 *                   example: 2
 *       404:
 *         description: Booking not found
 *       403:
 *         description: Only guests and admins can view bookings
 */
router.get('/:id', authorizeRoles('guest', 'admin'), bookingController.getBookingById);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *       403:
 *         description: Only guests can cancel bookings
 */
router.delete('/:id', authorizeRoles('guest', 'admin'), bookingController.cancelBooking);

module.exports = router;
