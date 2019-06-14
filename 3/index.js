//Load config
const config = require('config');
//Load Joi
const Joi = require('@hapi/joi');
//Load joi-objectid
Joi.objectId = require('joi-objectid')(Joi);
//Load mongoose
const mongoose = require('mongoose')
//Load the categories module
const categories = require('./routes/categories');
//Load the customers module
const customers = require('./routes/customers');
//Load the tools module
const tools = require('./routes/tools');
//Load the rentals module
const rentals = require('./routes/rentals');
//Load the users module
const users = require('./routes/users');
//Load the auth module
const auth = require('./routes/auth');
//Load express 
const express = require('express');
//Save express function in a variable
const app = express();

//Check if the env variable is set
if(!config.get('jwtPrivateKey')){

    //Logs a fatal error if it is not set
    console.error('FATAL ERROR: rentool_jwtPrivateKey is not defined.');
    //Terminates the app by exiting the process
    process.exit(1);

}

//Connect returns a promise 
mongoose.connect('mongodb://localhost:37017/rentool', { useNewUrlParser: true })
.then(()=>{console.log('connected');})
.catch(err => console.error('connection failed', err));

//This allows us to parse JSON in the body (req.body.name)
app.use(express.json());
//Load the categories route
app.use('/api/categories', categories);
//Load the customers route
app.use('/api/customers', customers);
//Load the tools route
app.use('/api/tools', tools);
//Load the rentals route
app.use('/api/rentals', rentals);
//Load the users route
app.use('/api/users', users);
//Load the auth route
app.use('/api/auth', auth);

//Process a global object that has an env variable that stores the port
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}`));