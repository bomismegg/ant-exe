// src/controllers/review.controller.js

const reviewService = require('../services/review.service');
const catchAsync = require('../helpers/catch.async');
const { OK } = require('../core/success.response');

class ReviewController {

    // Add a new review
    addReview = catchAsync(async (req, res) => {
        const { userId } = req.user;
        const { propertyId, rating, comment } = req.body;
        const review = await reviewService.addReview(userId, { propertyId, rating, comment });
        OK(res, 'Review added successfully', review);
    });

    // Get reviews for a property
    getReviewsByProperty = catchAsync(async (req, res) => {
        const { propertyId } = req.params;
        const reviews = await reviewService.getReviewsByProperty(propertyId);
        OK(res, 'Reviews fetched successfully', reviews);
    });

    // Update a review
    updateReview = catchAsync(async (req, res) => {
        const { userId } = req.user;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const updatedReview = await reviewService.updateReview(userId, reviewId, { rating, comment });
        OK(res, 'Review updated successfully', updatedReview);
    });

    // Delete a review
    deleteReview = catchAsync(async (req, res) => {
        const { userId } = req.user;
        const { reviewId } = req.params;
        await reviewService.deleteReview(userId, reviewId);
        OK(res, 'Review deleted successfully');
    });
}

module.exports = new ReviewController();
