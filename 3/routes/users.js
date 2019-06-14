//Load auth middleware
const auth = require('../middleware/auth');
//Load bcrypt
const bcrypt = require('bcrypt');
//Load lodash
const _ = require('lodash');
//Load User Schema and validateUser
const {User, validateUser} = require('../models/user');
//Load mongoose
const mongoose = require('mongoose');
//Load express
const express = require('express');
//Load router
const router = express.Router();

//Create "/" POST route
router.post('/', async(req, res) => {

    //Grab the error part of the object and store it in an object called error
    const {error} = validateUser(req.body);
 
    //Return 400 if invalid
    if(error) return res.status(400).send(error.details[0].message);
 
    //Find email in users collection
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email already in use');
 
    //Create a new User Model
    user = new User(_.pick(req.body,['name', 'email', 'password']));

    //Hash and Salt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
 
    //Adds the user
    await user.save();

    //Call the user.generateAuthToken()
    const token = user.generateAuthToken();

    //Send back data in the header
    res.header('x-auth-token', token);

    //Pick the properties we want from an object
    res.send(_.pick(user, ['_id', 'name', 'email']));
    
});

//
router.get('/me', auth, async(req, res, next)=> {

    //Search ID in the database
    const user = await User.findById(req.user._id).select('-password');

    //Sends user data back to the client
    res.send(user);
});

//Export Router
module.exports = router;