//Load Category Schema and validateCategory
const {Category, validateCategory} = require('../models/category')
//Load mongoose
const mongoose = require('mongoose');
//Load express
const express = require('express');
//Load router
const router = express.Router();

//Create "/" GET route
router.get('/', async(req, res) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
});

//Create "/" POST route
router.post('/', async(req, res) => {

   //Grab the error part of the object and store it in an object called error
   const {error} = validateCategory(req.body);

   //Return 400 if invalid
   if(error) return res.status(400).send(error.details[0].message);

    //Create a new Category Model and pass in the data we want to save
    let category = new Category({name: req.body.name});

    //Adds the category
    category = await category.save();

    //Send the category back as a response
    res.send(category);
});

//Create "/:id" UPDATE route
router.put('/:id', async(req, res) => {

    //Return 400 if invalid
    const {error} = validateCategory(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Find by ID and Update
    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

    //Return a 404 status if not found and send a message
    if(!category) return res.status(404).send('The category ID was not found!');

    //Return the updated category to the client
    res.send(category);

});

//Create "/:id" DELETE route
router.delete('/:id', async(req, res) => {

    //Find and remove document
    const category = await Category.findByIdAndRemove(req.params.id);

    //Return a 404 status if not found and send a message
    if(!category) return res.status(404).send('The category ID was not found!');

    //Return the category
    res.send(category);

});

//Create "/:id" GET route
router.get('/:id', async(req, res) => {

    //Find document
    const category = await Category.findById(req.params.id);

    //Return a 404 status if not found and send a message
    if(!category) return res.status(404).send('The category ID was not found!');
    //Return the category
    res.send(category);
});

//Export the routes
module.exports = router;