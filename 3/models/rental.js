//Load mongoose
const mongoose = require('mongoose');
//Load Joi
const Joi = require('@hapi/joi');
//Load joi-objectid
Joi.objectId = require('joi-objectid')(Joi);
//Embed the categorySchema in the toolSchema 
const {categorySchema} = require('./category')

//Create Schema
const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
        }),
        required: true
    },
    tool: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255
            },
            category: {
                type: categorySchema,
                required: true
            },
            hourlyRentalRate: {
                type: Number, 
                required: true,
                min: 0,
                max: 24
            },
            dailyRentalRate: {
                type: Number, 
                required: true,
                min: 0,
                max: 365
            }
        }),
        required: true
    },
    hourOut: {
        type: Date, 
        required: true,
        default: Date.now
    },
    hourReturn: {
        type: Date
    },
    dateOut: {
        type: Date, 
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number, 
        min: 0
    }
}));

//Make JOI ValidateCustomer function
function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        toolId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
};

//Export Schema and joi validation
exports.Rental = Rental; 
exports.validateRental = validateRental;