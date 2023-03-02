const mongoose = require('mongoose');
const Joi = require('joi');
const {contactSchema} = require("./contacts");

const customerSchema = new mongoose.Schema({

    name: {
        type: 'string',
        required: true,
        minLength: 5,
        maxLength: 50
    },

    contacts: {
        type: [contactSchema]
    },
    phone: {
        type: String,
        required: true
    },
    isGold: {
        type: 'boolean',
        default: false
    }
});

function validateCustomer(customer) {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        contacts: Joi.array().required(),
        isGold: Joi.boolean().required()
    });
    return schema.validate(customer);
}

/*function validate(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }
    return Joi.validate(customer, schema);
}*/

exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
