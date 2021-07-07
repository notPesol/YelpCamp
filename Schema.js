const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        // images: Joi.array().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }),
    // deleteImage: Joi.array()
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().min(5).max(500),
        rating: Joi.number().required().min(1).max(5)
    }).required()
}).required();