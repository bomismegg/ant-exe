const Booking = require('../models/booking.model');
const PropertyService = require('./property.service');
const { Api404Error, BusinessLogicError } = require('../core/error.response');

class BookingService {

    // Create a new booking
    static async createBooking(userId, { propertyId, startDate, endDate, guestCount, paymentMethod }) {
        // Check if the property exists and is available
        const property = await PropertyService.getPropertyById(propertyId);
        if (!property || !property.isAvailable) throw new Api404Error('Property not available');
    
        // Calculate the total price
        const nights = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        const totalPrice = property.pricePerNight * nights * guestCount;
        const booking = await Booking.create({
            property: propertyId,
            guest: userId,
            startDate,
            endDate,
            guestCount,
            totalPrice,
            paymentMethod,  
            status: 'pending'
        });
    
        return booking;
    }
    

    // Get bookings for a specific user
    static async getBookingsByUser(userId) {
        return await Booking.find({ guest: userId }).populate('property');
    }

    // Get a specific booking by ID
    static async getBookingById(bookingId) {
        const booking = await Booking.findById(bookingId).populate('property');
        if (!booking) throw new Api404Error('Booking not found');
        return booking;
    }

    // Cancel a booking
    static async cancelBooking(bookingId, userId) {
        const booking = await Booking.findById(bookingId);
        if (!booking) throw new Api404Error('Booking not found');
        if (booking.guest.toString() !== userId) throw new BusinessLogicError('Unauthorized');

        booking.status = 'canceled';
        await booking.save();
        return booking;
    }
}

module.exports = BookingService;
