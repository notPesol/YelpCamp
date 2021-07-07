const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLogedIn, validateCampground, isAuthor } = require('../middleware');


const { storage } = require('../cloudinary') // node auto looking for index file
//require multer for handling multipart/form-data [upload file]
const multer = require('multer');
const upload = multer({ storage })

// controller
const campgrounds = require('../controllers/campgrounds');

// group same path by route
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLogedIn, validateCampground, upload.array('image'), catchAsync(campgrounds.createCampground)); // make a campground

// route for form for user create new campgrounds
router.get('/new', isLogedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.detailCampground)) //detail a campground
    .put(isLogedIn, isAuthor, validateCampground, upload.array('image'), catchAsync(campgrounds.updateCampground)) // update campground
    .delete(isLogedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // delete campground

// route for edit  campground page
router.get('/:id/edit', isLogedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;