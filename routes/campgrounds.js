const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLogedIn, validateCampground, isAuthor } = require('../middleware')

// route for index of campgrounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

}));

// route for form for user create new campgrounds
router.get('/new', isLogedIn, (req, res) => {
    res.render('campgrounds/new');
});

// making a campground 
router.post('/', isLogedIn, validateCampground, catchAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a Campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// route for detail a campground
router.get('/:id', catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            })
            .populate('author');
        console.log(camp)
        res.render('campgrounds/detail', { camp });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/campgrounds');
    }
}));

// route for edit  campground page
router.get('/:id/edit', isLogedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    return res.render('campgrounds/edit', { camp });
}));

// update a campground
router.put('/:id', isLogedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated a Campgrounds!')
    res.redirect(`/campgrounds/${camp._id}`)
}));

// delete a campground
router.delete('/:id', isLogedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;