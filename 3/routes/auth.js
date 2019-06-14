//Load bcrypt
const bcrypt = require('bcrypt');
//Load lodash
const _ = require('lodash');
//Load User Schema and validateUser
const {User} = require('../models/user');
//Load mongoose
const mongoose = require('mongoose');
//Load express
const express = require('express');
//Load Joi
const Joi = require('@hapi/joi');
//Load router
const router = express.Router();

//Create "/" POST route
router.post('/', async(req, res) => {

    //Grab the error part of the object and store it in an object called error
    const {error} = validateAuth(req.body);
 
    //Return 400 if invalid
    if(error) return res.status(400).send(error.details[0].message);
 
    //Find email in users collection
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    //Checks the password against the returned user using bcrypt.compare
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    //Call the user.generateAuthToken()
    const token = user.generateAuthToken();

    //Return the token
    res.send(token);
    
});

////Make JOI ValidateAuth function
function validateAuth(auth) {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(1024).required()
    };
    return Joi.validate(auth, schema);
}

//Export Router
module.exports = router;