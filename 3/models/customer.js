//Load mongoose
const mongoose = require('mongoose');
//Load Joi
const Joi = require('@hapi/joi');

//Create Schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 255
    }
});

//Create Model from Schema
const Customer = mongoose.model('Customer', customerSchema);

//Make JOI ValidateCustomer function
function validateCustomer(customer){
    const schema = {
        name: Joi.string().required().min(3).max(255),
        isPremium: Joi.boolean(),
        phone: Joi.string().required().min(3).max(255),
        email: Joi.string().email().required().min(3).max(255)
    };

    return Joi.validate(customer, schema);
};

//Export the model and joi validation
module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;