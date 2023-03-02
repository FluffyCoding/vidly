const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({

    contactType: {
        type: String,
        enum: ['MOBILE', 'PHONE'],
        required: true
    },
    contactNumber: {
        type: 'string',
        required: true,
    }
});

function validateContact(contact) {
    const schema = Joi.object().keys({
        contactNumber: Joi.string().min(7).required(),
        contactType: Joi.string().required()
    });
    return schema.validate(contact);
}

exports.contactSchema = contactSchema;
exports.validate = validateContact;
