//Load auth middleware
const auth = require('../middleware/auth');
//Load Customer Schema and validateCustomer
const {Customer, validateCustomer} = require('../models/customer');
//Load mongoose
const mongoose = require('mongoose');
//Load express
const express = require('express');
//Load router
const router = express.Router();

//Create "/" GET route
router.get('/', async(req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

//Create "/" POST route
router.post('/', auth, async(req, res) => {

    //Grab the error part of the object and store it in an object called error
    const {error} = validateCustomer(req.body);
 
    //Return 400 if invalid
    if(error) return res.status(400).send(error.details[0].message);
 
     //Create a new Customer Model and pass in the data we want to save
     let customer = new Customer({
         name: req.body.name,
         isPremium: req.body.isPremium,
         phone: req.body.phone,
         email: req.body.email
        });
 
     //Adds the customer
     customer = await customer.save();
 
     //Send the customer back as a response
     res.send(customer);
 });

 //Create "/:id" UPDATE route
router.put('/:id', auth, async(req, res) => {

    //Return 400 if invalid
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Find by ID and Update
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isPremium: req.body.isPremium,
        phone: req.body.phone,
        email: req.body.email 
    },
    {
        new: true
    });

    //Return a 404 status if not found and send a message
    if(!customer) return res.status(404).send('The customer ID was not found!');

    //Return the updated customer to the client
    res.send(customer);
});

//Create "/:id" DELETE route
router.delete('/:id', auth, async(req, res) => {

    //Find and remove document
    const customer = await Customer.findByIdAndRemove(req.params.id);

    //Return a 404 status if not found and send a message
    if(!customer) return res.status(404).send('The customer ID was not found!');

    //Return the customer
    res.send(customer);
});

//Create "/:id" GET route
router.get('/:id', async(req, res) => {

    //Find document
    const customer = await Customer.findById(req.params.id);

    //Return a 404 status if not found and send a message
    if(!customer) return res.status(404).send('The customer ID was not found!');
    //Return the customer
    res.send(customer);
});

//Export Router
module.exports = router;