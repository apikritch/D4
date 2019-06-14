//Load config
const config = require('config');
//Load jsonwebtoken
const jwt = require('jsonwebtoken');
//Load mongoose
const mongoose = require('mongoose');
//Load Joi
const Joi = require('@hapi/joi');

//Create Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    isAdmin: Boolean
});

//Attach the token function
userSchema.methods.generateAuthToken = function(){
  
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;

}

//Create Model from Schema
const User = mongoose.model('User', userSchema);

//Make JOI ValidateUser function
function validateUser(user){
    const schema = {
        name: Joi.string().required().min(3).max(255),
        email: Joi.string().email().required().min(3).max(255),
        password: Joi.string().required().min(8).max(1024)
    };

    return Joi.validate(user, schema);
};

//Export the model and joi validation
module.exports.User = User;
module.exports.validateUser = validateUser;