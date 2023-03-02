const mongoose = require('mongoose');
const express = require('express');
const {Movie, validate} = require("../models/movies");
const {genreSchema} = require('../models/genres')

const router = express.Router();

const Genre = mongoose.model('Genre', genreSchema);

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById({_id: req.body.genreId});
    if (!genre) res.status(400).send('invalid genre');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    let result = await movie.save();
    res.send(result);
});

exports.moviesRouter = router;
