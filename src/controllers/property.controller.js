// src/controllers/property.controller.js

const propertyService = require('../services/property.service');
const catchAsync = require('../helpers/catch.async');
const { OK } = require('../core/success.response');

class PropertyController {

    // Get all properties (public route)
    getAllProperties = catchAsync(async (req, res) => {
        const properties = await propertyService.getAllProperties(req.query);
        OK(res, 'Properties fetched successfully', properties);
    });

    // Get a specific property by ID (public route)
    getPropertyById = catchAsync(async (req, res) => {
        const property = await propertyService.getPropertyById(req.params.id);
        OK(res, 'Property fetched successfully', property);
    });

    // Create a new property (host only)
    createProperty = catchAsync(async (req, res) => {
        const { userId } = req.user;
        const { body, files } = req; // Multer handles file uploads and stores them in req.files
        const property = await propertyService.createProperty(userId, body, files);
        OK(res, 'Property created successfully', property);
    });

    // Update an existing property (host only)
    updateProperty = catchAsync(async (req, res) => {
        const { userId } = req.user;
        const { id } = req.params;
        const { body, files } = req;
        const property = await propertyService.updateProperty(id, userId, body, files);
        OK(res, 'Property updated successfully', property);
    });

    // Delete a property (host only)
    deleteProperty = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { userId } = req.user;
        await propertyService.deleteProperty(id, userId);
        OK(res, 'Property deleted successfully');
    });
}

module.exports = new PropertyController();
