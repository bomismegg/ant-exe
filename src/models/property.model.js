const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Property';
const COLLECTION_NAME = 'Properties';

const propertySchema = new Schema({
    propertyType: {
        type: String,
        enum: ['house', 'apartment', 'villa'],
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the user (host)
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }], // Array of strings for amenities like WiFi, Parking, etc.
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    images: [{ type: String }], // S3 links to property images
    isAvailable: { type: Boolean, default: true },
    maxGuests: { type: Number, required: true },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }], // Reviews associated with this property
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, propertySchema);
