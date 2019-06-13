//Load mongoose
const mongoose = require('mongoose');
//Load Joi
const Joi = require('@hapi/joi');

//Create Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
});

//Create Model from Schema
const Category = mongoose.model('Category', categorySchema);

//Make JOI ValidateCategory function
function validateCategory(category){
    const schema = {
        name: Joi.string().required().min(3).max(255)
    };
    return Joi.validate(category, schema);
};

//Export categorySchema
module.exports.categorySchema = categorySchema;
//Export the model and joi validation
module.exports.Category = Category;
module.exports.validateCategory = validateCategory;