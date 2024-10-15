/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: API for managing properties
 */

const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { authentication, authorizeRoles } = require('../auth/authUtils');
const upload = require('../configs/multer.config'); // Import multer config

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: A list of all properties
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
 *                   propertyType:
 *                     type: string
 *                     example: "apartment"
 *                   location:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         example: "San Francisco"
 *                       country:
 *                         type: string
 *                         example: "USA"
 *                   pricePerNight:
 *                     type: number
 *                     example: 150
 *       404:
 *         description: No properties found
 */
router.get('/', propertyController.getAllProperties);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get a specific property by ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property
 *     responses:
 *       200:
 *         description: The details of the property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
 *                 propertyType:
 *                   type: string
 *                   example: "apartment"
 *                 location:
 *                   type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                       example: "San Francisco"
 *                     country:
 *                       type: string
 *                       example: "USA"
 *                 pricePerNight:
 *                   type: number
 *                   example: 150
 *       404:
 *         description: Property not found
 */
router.get('/:id', propertyController.getPropertyById);

// Protected routes (Require JWT authentication)
router.use(authentication);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 example: "apartment"
 *               pricePerNight:
 *                 type: number
 *                 example: 150
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Property created successfully
 *       403:
 *         description: Only hosts or admins can create properties
 */
router.post('/', authorizeRoles('host', 'admin'), upload.array('images', 5), propertyController.createProperty);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *                 example: "apartment"
 *               pricePerNight:
 *                 type: number
 *                 example: 150
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       403:
 *         description: Only hosts or admins can update properties
 */
router.put('/:id', authorizeRoles('host', 'admin'), upload.array('images', 5), propertyController.updateProperty);

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the property to delete
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       403:
 *         description: Only hosts or admins can delete properties
 */
router.delete('/:id', authorizeRoles('host', 'admin'), propertyController.deleteProperty);

module.exports = router;
