const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    }

});

function validateGenre(genre) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(10).required()
    });
    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.validate = validateGenre;
