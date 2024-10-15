// src/services/review.service.js

const Review = require('../models/review.model');
const Property = require('../models/property.model');
const Booking = require('../models/booking.model');
const { Api404Error, BusinessLogicError } = require('../core/error.response');

class ReviewService {

    // Add a new review
    static async addReview(userId, { propertyId, rating, comment }) {
        // Check if the user has completed a booking for the property
        const booking = await Booking.findOne({ guest: userId, property: propertyId, status: 'completed' });
        if (!booking) {
            throw new BusinessLogicError('You can only review properties you have stayed at');
        }

        // Create the review
        const review = await Review.create({
            property: propertyId,
            guest: userId,
            rating,
            comment
        });

        // Update the property's average rating
        await ReviewService.updatePropertyRating(propertyId);

        return review;
    }

    // Fetch reviews for a property
    static async getReviewsByProperty(propertyId) {
        const reviews = await Review.find({ property: propertyId, isDeleted: false }).populate('guest', 'name');
        if (!reviews || reviews.length === 0) {
            throw new Api404Error('No reviews found for this property');
        }
        return reviews;
    }

    // Update a review
    static async updateReview(userId, reviewId, { rating, comment }) {
        const review = await Review.findOne({ _id: reviewId, guest: userId, isDeleted: false });
        if (!review) {
            throw new Api404Error('Review not found');
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        // Update the property's average rating
        await ReviewService.updatePropertyRating(review.property);

        return review;
    }

    // Soft delete a review
    static async deleteReview(userId, reviewId) {
        const review = await Review.findOne({ _id: reviewId, guest: userId, isDeleted: false });
        if (!review) {
            throw new Api404Error('Review not found');
        }

        review.isDeleted = true;
        await review.save();

        // Update the property's average rating
        await ReviewService.updatePropertyRating(review.property);

        return { message: 'Review deleted successfully' };
    }

    // Update the average rating for a property
    static async updatePropertyRating(propertyId) {
        const reviews = await Review.find({ property: propertyId, isDeleted: false });
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        await Property.findByIdAndUpdate(propertyId, { averageRating });
    }
}

module.exports = ReviewService;
