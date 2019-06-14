//Load auth middleware
const auth = require('../middleware/auth');
//Load Tool Schema and validateCategory
const {Tool, validateTool} = require('../models/tool');
//Load Category
const {Category} = require('../models/category');
//Load mongoose
const mongoose = require('mongoose');
//Load express
const express = require('express');
//Load router
const router = express.Router();

//Create "/" GET route
router.get('/', async(req, res) => {
    const tools = await Tool.find().sort('name');
    res.send(tools);
});

//Create "/" POST route
router.post('/', auth, async(req, res) => {

   //Grab the error part of the object and store it in an object called error
   const {error} = validateTool(req.body);

   //Return 400 if invalid
   if(error) return res.status(400).send(error.details[0].message);

   const category = await Category.findById(req.body.categoryId);
   if(!category) return res.status(400).send('Invalid category.');

    //Create a new Tool Model and pass in the data to save
    let tool = new Tool(
        {
            name: req.body.name,
            category: {
                _id: category._id,
                name: category.name
            },
            numberInStock: req.body.numberInStock,
            hourlyRentalRate: req.body.hourlyRentalRate,
            dailyRentalRate: req.body.dailyRentalRate
        }
    );

    //Adds the tool
    tool = await tool.save();

    //Send the tool back as a response
    res.send(tool);
});

//Create "/:id" UPDATE route
router.put('/:id', auth, async(req, res) => {

    //Return 400 if invalid
    const {error} = validateTool(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById(req.body.categoryId);
    if(!category) return res.status(400).send('Invalid category.');

    //Find by ID and Update
    const tool = await Tool.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            category: {
                _id: category._id,
                name: category.name
            },
            numberInStock: req.body.numberInStock,
            hourlyRentalRate: req.body.hourlyRentalRate,
            dailyRentalRate: req.body.dailyRentalRate
        }, {new: true});

    //Return a 404 status if not found and send a message
    if(!tool) return res.status(404).send('The tool ID was not found!');

    //Return the updated tool to the client
    res.send(tool);

});

//Create "/:id" DELETE route
router.delete('/:id', auth, async(req, res) => {

    //Find and remove document
    const tool = await Tool.findByIdAndRemove(req.params.id);

    //Return a 404 status if not found and send a message
    if(!tool) return res.status(404).send('The tool ID was not found!');

    //Return the tool
    res.send(tool);

});

//Create "/:id" GET route
router.get('/:id', async(req, res) => {

    //Find document
    const tool = await Tool.findById(req.params.id);

    //Return a 404 status if not found and send a message
    if(!tool) return res.status(404).send('The tool ID was not found!');
    //Return the tool
    res.send(tool);
});

//Export the routes
module.exports = router;