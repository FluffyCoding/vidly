const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const format = require('date-format')
const auth = require('../middleware/auth')
const {User, validateLogin} = require('../models/users')
const jwt = require('jsonwebtoken');
const router = express.Router();
let userWithToken = {
    user: User,
    token: String,
    expiry: Date
}

router.post('/', async (req, res) => {
    const {error} = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let userExist = await User.findOne({email: req.body.email});
    if (!userExist) return res.status(400).send('Invalid Username or Password');

    const validPassword = await bcrypt.compare(req.body.password, userExist.password);
    if (!validPassword) {
        return res.status(404).send('Invalid Username or Password');
    }

    const authToken = await userExist.generateAuthToken(userExist);
    res.header('jwt-token', authToken).status(200)
        .send(_.pick(userExist, ['_id', 'name']));

});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select(['-password', '-__v']);
    let expDate = new Date(req.user.exp * 1000);

    userWithToken.user = user;
    userWithToken.token = req.header('Authorization');
    userWithToken.expiry = expDate.toLocaleString();
    
    res.send(userWithToken);
});


exports.authRouter = router;
