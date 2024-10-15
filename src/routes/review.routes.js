/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing property reviews
 */

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authentication, authorizeRoles } = require('../auth/authUtils');

/**
 * @swagger
 * /reviews/{propertyId}:
 *   get:
 *     summary: Get all reviews for a property
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property to get reviews for
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f8b7e4c3b0c68b789"
 *                   rating:
 *                     type: number
 *                     example: 4
 *                   comment:
 *                     type: string
 *                     example: "Great place to stay!"
 *                   guest:
 *                     type: string
 *                     example: "60b9f9308c9b3b0015f5d78c"
 *                   property:
 *                     type: string
 *                     example: "60c72b2f8b7e4c3b0c68b123"
 *       404:
 *         description: No reviews found
 */
router.get('/:propertyId', reviewController.getReviewsByProperty);

// Protected routes (Require JWT authentication)
router.use(authentication);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
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
 *                 example: "60c72b2f8b7e4c3b0c68b123"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great stay, highly recommended!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review added successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only guests can add reviews
 */
router.post('/', authorizeRoles('guest'), reviewController.addReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Updated comment - had a great stay!"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review updated successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the review author or admin can update the review
 */
router.put('/:reviewId', authorizeRoles('guest', 'admin'), reviewController.updateReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete (soft delete) a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the review author or admin can delete the review
 */
router.delete('/:reviewId', authorizeRoles('guest', 'admin'), reviewController.deleteReview);

module.exports = router;
