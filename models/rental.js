const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const Rental = mongoose.model('Rental', new mongoose.Schema({

    customer: {
        type: new mongoose.Schema({
            name: String,
            isGold: Boolean,
            phone: String
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: String,
            dailyRental: Number,

        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dateReturned: {
        type: Date,
        required: false
    },
    rentalFee: {
        type: Number,
        required: true,
        min: 0
    }

}));

function validateRental(rental) {
    const schema = Joi.object().keys({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
