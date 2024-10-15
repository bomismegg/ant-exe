const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Review';
const COLLECTION_NAME = 'Reviews';

const reviewSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    }, // Reference to the property being reviewed
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the guest (user)
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }, // Rating between 1 and 5
    comment: {
        type: String,
        required: true
    },
    isDeleted: { type: Boolean, default: false }, // Soft delete feature
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, reviewSchema);
