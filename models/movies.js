const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require("./genres");

const Movie = new mongoose.model('Movies', new mongoose.Schema({
    title: {
        required: true,
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 50
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: false
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validateMovie(movie) {
    const schema = Joi.object().keys({
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
