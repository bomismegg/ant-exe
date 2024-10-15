const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Booking';
const COLLECTION_NAME = 'Bookings';

const bookingSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    }, // Reference to the property being booked
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the guest (user)
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'paid', 'failed']
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer'],
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'completed', 'canceled']
    },
    guestCount: {
        type: Number,
        default: 1,
        required: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, bookingSchema);
