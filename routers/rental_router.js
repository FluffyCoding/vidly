const express = require('express');
const mongoose = require('mongoose');
const {Rental, validate} = require("../models/rental");
const {customerSchema} = require("../models/customers");
const {Movie} = require("../models/movies");
const {response} = require("express");


const router = express.Router();
const Customer = mongoose.model('Customer', customerSchema);


router.get('/', async (req, res) => {
    const result = await Rental.find().sort('-dateOut');
    return res.send(result);
});
router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.send(error.details[0].message).status(400);


    let result = null
    const _customer = await Customer.findById({_id: req.body.customerId});
    if (!_customer) return res.status(400).send('Invalid Customer');

    const _movie = await Movie.findById({_id: req.body.movieId});
    if (!_movie) return res.status(400).send('Invalid Movie');

    if (_movie.numberInStock === 0) return res.status(400).send('Movie not Available');

    // const session = await mongoose.startSession();

    // session.startTransaction();

    try {

        // const option = {session, new: true}
        const rental = new Rental({
            customer: {
                _id: _customer._id,
                name: _customer.name,
                phone: _customer.phone
            },
            movie: {
                _id: _movie._id,
                title: _movie.title,
                dailyRentalRate: _movie.dailyRentalRate
            },
            dateOut: Date.now(),
            rentalFee: 15
        });
        result = await rental.save()
        try {
            const stockResult = await Movie.findByIdAndUpdate({_id: req.body.movieId}, {
                numberInStock: --_movie.numberInStock
            });
            console.log(`Stock Count : ${stockResult}`)
        } catch (e) {
            return res.status(400).send(e.details[0].message);
        }

        // await session.commitTransaction();
        res.status(200).send(result);

    } catch (e) {
        return res.status(400).send(e);

    }

    // let rental = new Rental({
    //     customer: {
    //         _id: customer._id,
    //         name: customer.name,
    //         phone: customer.phone
    //     },
    //     movie: {
    //         _id: movie._id,
    //         title: movie.title,
    //         dailyRentalRate: movie.dailyRentalRate
    //     }
    // });
    //
    //
    //
    //
    // const result = await rental.save();
    // movie.dailyRentalRate--;
    // movie.save();
    // response.send(result);
});

exports.rentalRouter = router;
