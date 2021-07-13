const Campground = require('../models/campground');

const { cloudinary, storage } = require('../cloudinary');


const mapboxToken = process.env.MAPBOX_TOKEN;
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeoCoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const { campground } = req.body;
    const geoData = await geoCoder.forwardGeocode({
        query: campground.location,
        limit: 1
    }).send();
    const geometry = geoData.body.features[0].geometry;
    if(!geometry){
        req.flash('error', 'No coordinates data!');
        return res.redirect('/campgrounds/new');
    }
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.images = images;
    newCampground.geometry = geometry;
    await newCampground.save();
    req.flash('success', 'Successfully made a Campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.detailCampground = async (req, res, next) => {
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
        res.render('campgrounds/detail', { camp });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/campgrounds');
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    return res.render('campgrounds/edit', { camp });
}

module.exports.updateCampground = async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...images);
    await camp.save();
    if (req.body.deleteImages) {
        for (let imgName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(imgName);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(camp);
    }
    req.flash('success', 'Successfully updated a Campgrounds!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a Campground!');
    res.redirect('/campgrounds');
}