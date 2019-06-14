//Load auth middleware
const auth = require('../middleware/auth');
//Load Tool Schema and validateCategory
const {Rental, validateRental} = require('../models/rental');
//Load Tool
const {Tool} = require('../models/tool');
//Load Customer
const {Customer} = require('../models/customer');
//Load mongoose
const mongoose = require('mongoose');
//Load fawn
const Fawn = require('fawn');
//Load express
const express = require('express');
//Load router
const router = express.Router();

//Start fawn and pass it our mongoose object
Fawn.init(mongoose);

//Create "/" GET route
router.get('/', async(req, res, next) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

//Create "/" POST route
router.post('/', auth, async(req, res) => {

    //Grab the error part of the object and store it in an object called error
    const {error} = validateRental(req.body);
 
    //Return 400 if invalid
    if(error) return res.status(400).send(error.details[0].message);
 
    //Check customer ID
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer.');

    //Check tool ID
    const tool = await Tool.findById(req.body.toolId);
    if(!tool) return res.status(400).send('Invalid tool.');
 
    //Check the tool is in stock
    if (tool.numberInStock === 0) return res.status(400).send('Tool not in stock.');

    //Create a new Rental Model and pass in the data to save
    let rental = new Rental(
        {
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
                email: customer.email
            },
            tool: {
                _id: tool._id,
                name: tool.name,
                category: tool.category,
                hourlyRentalRate: tool.hourlyRentalRate,
                dailyRentalRate: tool.dailyRentalRate
            }
        }
    );
    
    //Allows multiple operations to be run as a transaction
    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('tools', {_id: tool._id}, {$inc: {numberInStock: -1}})
        .run();

        res.send(rental);
    }catch(ex){
        res.status(500).send('Something failed');
    }
    
});

//Create "/:id" GET route
router.get('/:id', async(req, res) => {

    //Find document
    const rental = await Rental.findById(req.params.id);

    //Return a 404 status if not found and send a message
    if(!rental) return res.status(404).send('The rental ID was not found!');
    //Return the tool
    res.send(rental);
});

//Export the route
module.exports = router;