const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validateUser} = require('../models/users')

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.post('/', async (req, res) => {

    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let isExist = await User.findOne({email: req.body.email});
    if (isExist) return res.status(400).send('User With Email Already Registered');

    const user = new User(_.pick(req.body, ['name', 'email', 'password', 'authorities']));
    const genSalt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, genSalt);
    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email', 'authorities'])).status(200);
});


exports.userRouter = router;
