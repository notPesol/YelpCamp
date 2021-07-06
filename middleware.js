const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./Schema');
const Campground = require('./models/campground');
const Review = require('./models/review')

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) throw new ExpressError(error, 400);
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(d => d.message);
        throw new ExpressError(msg, 400);
    }
    next();
}

module.exports.isLogedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`)
        }
        return next();
    } catch (error) {
        next(new ExpressError(error.message, 404));
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`)
        }
        return next();
    } catch (error) {
        next(new ExpressError(error.message, 404));
    }
}