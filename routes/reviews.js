const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLogedIn, isReviewAuthor } = require('../middleware');

// make a review
router.post('/', isLogedIn, validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    console.log(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created a Review!')
    res.redirect(`/campgrounds/${camp._id}`);
}));

//delete a review
router.delete('/:reviewId', isLogedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a Review!')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;