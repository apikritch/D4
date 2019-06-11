//Load debug
const startupDebugger = require('debug')('app:startup');
//Load debug
const dbDebugger = require('debug')('app:db');
//Load config
const config = require('config');
//Load helmet
const helmet = require('helmet');
//Load morgan
const morgan = require('morgan');
//Load Joi
const Joi = require('@hapi/joi');
//Import logger
const logger = require('./middleware/logger')
//Load the tools module
const tools = require('./routes/tools');
//Load the home module
const home = require('./routes/home');
//Import authentication
const authentication = require('./authentication')
//Load express function
const express = require('express');
//Save express function in a variable
const app = express();

//Use the helmet middleware
app.use(helmet());
//Use logger in the middleware pipeline
app.use(logger);
//Use authentication in the middleware pipeline
app.use(authentication);
//Allow you to serve static files
app.use(express.static('public'))
//This allows us to parse JSON in the body (req.body.name)
app.use(express.json());
//Converts this data to JSON and saves it in req.body and parse arrays using the urlencoded format
app.use(express.urlencoded({ extended: true }));
//Specifies when to use this module and specifies the module to use
app.use('/api/tools', tools);
app.use('/', home);

console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);

//Pull the mail password from the config file
console.log(`Mail Password: ${config.get('mail.password')}`);

//get the env from express
if(app.get('env') === 'development'){
    //Use the morgan middleware
    app.use(morgan('tiny')); 
    startupDebugger('Morgan enabled...');
}

dbDebugger('connected to the database...');

//Create "/api/tools/:catergory/:brand" GET route
app.get('/api/tools/:catergory/:brand', (req, res) => {
    res.send(req.params);
});

//Process a global object that has an env variable that stores the port
const port = process.env.PORT || 3000
app.listen(3000, () => console.log(`Listening on port ${port}`));