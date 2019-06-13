//Load mongoose
const mongoose = require('mongoose')
//Load the categories module
const categories = require('./routes/categories');
//Load the customers module
const customers = require('./routes/customers');
//Load the tools module
const tools = require('./routes/tools');
//Load express 
const express = require('express');
//Save express function in a variable
const app = express();

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

//Process a global object that has an env variable that stores the port
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}`));