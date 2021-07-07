const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const { validateReview, isLogedIn, isReviewAuthor } = require('../middleware');

// controller
const reviews = require('../controllers/reviews');

// make a review
router.post('/', isLogedIn, validateReview, catchAsync(reviews.createReview));

//delete a review
router.delete('/:reviewId', isLogedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;