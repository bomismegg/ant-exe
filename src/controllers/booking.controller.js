const bookingService = require('../services/booking.service');
const catchAsync = require('../helpers/catch.async');
const { OK } = require('../core/success.response');

class BookingController {

    // Create a new booking
    createBooking = catchAsync(async (req, res) => {
        const booking = await bookingService.createBooking(req.user.userId, req.body);
        OK(res, 'Booking created successfully', booking);
    });

    // Get all bookings by the logged-in user
    getBookingsByUser = catchAsync(async (req, res) => {
        const bookings = await bookingService.getBookingsByUser(req.user.userId);
        OK(res, 'Bookings fetched successfully', bookings);
    });

    // Get a specific booking by ID
    getBookingById = catchAsync(async (req, res) => {
        const booking = await bookingService.getBookingById(req.params.id);
        OK(res, 'Booking fetched successfully', booking);
    });

    // Cancel a booking
    cancelBooking = catchAsync(async (req, res) => {
        await bookingService.cancelBooking(req.params.id, req.user.userId);
        OK(res, 'Booking canceled successfully');
    });
}

module.exports = new BookingController();
