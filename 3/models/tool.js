//Load mongoose
const mongoose = require('mongoose');
//Load Joi
const Joi = require('@hapi/joi');

//Embed the categorySchema in the toolSchema 
const {categorySchema} = require('./category');

//Create Schema
const Tool = mongoose.model('Tools', new mongoose.Schema({
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
    numberInStock: {
        type: Number, 
        required: true,
        min: 0,
        max: 100
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
}));

//Make JOI ValidateCategory function
function validateTool(tool){
    const schema = {
        name: Joi.string().required().min(3).max(255),
        categoryId: Joi.objectId().required(),
        numberInStock: Joi.number().required().min(0).max(100),
        hourlyRentalRate:Joi.number().required().min(0).max(24),
        dailyRentalRate: Joi.number().required().min(0).max(365)
    };
    return Joi.validate(tool, schema);
};

//Export categorySchema
module.exports.Tool = Tool;
//Export joi validation
module.exports.validateTool = validateTool;