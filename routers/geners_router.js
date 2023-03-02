const mongoose = require('mongoose');
const express = require('express');
const {genreSchema} = require("../models/genres");
const {validate} = require("../models/genres");
const auth = require("../middleware/auth");

const router = express.Router();

const Genres = mongoose.model('Genres', genreSchema)

router.get('/', async (req, res) => {

    console.log(req.query)

    if (!req.query.size || !req.query.page) {
        res.status(400).send('Filter size and page number is not valid');
    } else {
        let {page, size, name} = req.query;
        let query = {};

        if (page != null) query.page = page;
        if (size != null) query.size = size;
        if (name != null) query.name = name;


        const genres = await Genres.find(query).sort('name');
        res.send(genres);
    }
});

router.post('/',auth ,async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genres = new Genres();
    genres.name = req.body.name;

    const result = await genres.save();
    res.send(result);
});

router.delete('/', async (req, res) => {
    const result = await Genres.findByIdAndDelete({_id: req.query._id});
    res.send(result);
});


exports.genresRouter = router;
