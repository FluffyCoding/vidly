const express = require('express');
const mongoose = require('mongoose');
const {validate, customerSchema} = require("../models/customers");
const auth = require('../middleware/auth')

const router = express.Router();
const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req, res) => {
    console.log(req.query)

    if (!req.query.size || !req.query.page) {
        res.status(400).send('Filter size and page number is not valid');
    } else {
        let {page, size, name, isGold} = req.query;
        let query = {};

        if (page != null) query.page = page;
        if (size != null) query.size = size;
        if (name != null) query.name = name;
        if (isGold != null) query.isGold = isGold;

        const customers = await Customer.find(query).sort('name');
        res.send(customers);
    }
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer();
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.isGold = req.body.isGold;
    customer.contacts = req.body.contacts;
    const result = await customer.save();
    res.send(result);
});

router.delete('/', async (req, res) => {
    const result = await Customer.findByIdAndDelete({_id: req.query._id});
    res.send(result);
});


exports.customerRouter = router;
