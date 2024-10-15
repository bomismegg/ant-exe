// src/services/property.service.js

const Property = require('../models/property.model');
const S3Service = require('./s3.service');
const { Api404Error, BusinessLogicError } = require('../core/error.response');

class PropertyService {

    // Create a new property
    static async createProperty(hostId, propertyData, imageFiles = []) {
        // Attach the host to the property
        propertyData.host = hostId;

        // If there are images, upload them to S3
        const uploadedImages = [];
        if (imageFiles && imageFiles.length > 0) {
            for (let file of imageFiles) {
                const uploadedImageUrl = await S3Service.uploadFile(file.path); // Upload to S3
                uploadedImages.push(uploadedImageUrl);
            }
        }

        // Attach uploaded image URLs to property data
        propertyData.images = uploadedImages;

        // Create the property
        const newProperty = await Property.create(propertyData);
        return newProperty;
    }

    // Update a property
    static async updateProperty(propertyId, hostId, updateData, imageFiles = []) {
        // Check if the property exists and the host owns it
        const property = await Property.findById(propertyId);
        if (!property) throw new Api404Error('Property not found');
        if (property.host.toString() !== hostId) {
            throw new BusinessLogicError('Unauthorized');
        }

        // If there are new images, upload them to S3
        const uploadedImages = [];
        if (imageFiles && imageFiles.length > 0) {
            for (let file of imageFiles) {
                const uploadedImageUrl = await S3Service.uploadFile(file.path); // Upload to S3
                uploadedImages.push(uploadedImageUrl);
            }
        }

        // Merge uploaded images with existing images (if any)
        if (uploadedImages.length > 0) {
            updateData.images = [...(property.images || []), ...uploadedImages];
        }

        // Update the property
        const updatedProperty = await Property.findByIdAndUpdate(propertyId, updateData, { new: true });
        return updatedProperty;
    }

    // Other methods remain the same...
    static async getAllProperties(filters) {
        const properties = await Property.find(filters).populate('host');
        return properties;
    }

    static async getPropertyById(propertyId) {
        const property = await Property.findById(propertyId).populate('host');
        if (!property) throw new Api404Error('Property not found');
        return property;
    }

    static async deleteProperty(propertyId, hostId) {
        const property = await Property.findById(propertyId);
        if (!property) throw new Api404Error('Property not found');
        if (property.host.toString() !== hostId) {
            throw new BusinessLogicError('Unauthorized');
        }

        await Property.findByIdAndDelete(propertyId);
        return { message: 'Property deleted successfully' };
    }

    static async calculateTotalCost(propertyId, nights) {
        const property = await Property.findById(propertyId);
        if (!property) throw new Api404Error('Property not found');

        const totalCost = property.pricePerNight * nights;
        return totalCost;
    }
}

module.exports = PropertyService;
