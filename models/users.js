const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxLength: 1024
    },
    authorities: {
        type: [String],
        default: 'READ'
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER', 'MODERATOR', 'GUEST'],
        required: true
    }

});

userSchema.methods.generateAuthToken = function () {

    const payLoad = {
        _id: this._id,
        name: this.name,
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (60 * 720),
        authorities: this.authorities,
        role: this.role
    }

    const token = jwt.sign(payLoad, process.env.JWT_TOKEN_KEY, {
        // expiresIn: '10h'
    });
    return token;
}

const User = new mongoose.model('User', userSchema);


function validateUserInput(user) {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required().label('User Name'),
        email: Joi.string().email({
            allowFullyQualified: true,
            minDomainSegments: 2,
            tlds: {allow: ['com', 'net', 'pk', 'jp']}
        }).required().label('Email'),
        password: passwordComplexity().required().label('Password'),
        authorities: Joi.array().required()
    });
    return schema.validate(user);
}

function validateUserLogin(user) {
    const schema = Joi.object().keys({
        email: Joi.string().email({
            allowFullyQualified: true,
            minDomainSegments: 2,
            tlds: {allow: ['com', 'net', 'pk', 'jp']}
        }).required(),
        password: passwordComplexity().required()
    });
    return schema.validate(user);
}


exports.User = User;
exports.validateUser = validateUserInput;
exports.validateLogin = validateUserLogin;


/*
Joi.string()
    .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')*/
