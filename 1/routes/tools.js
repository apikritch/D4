//Load express
const express = require('express');
//Load router
const router = express.Router();

//Create an array to store data for using in response
const tools = [
    {id:1, name: 'tool 1'},
    {id:2, name: 'tool 2'},
    {id:3, name: 'tool 3'}
]

//Create "/" GET route
router.get('/', (req, res) => {
    res.send(req.body);
});

//Create "/" POST route
router.post('/', (req, res) => {

   //Grab the error part of the object and store it in an object called error
   const {error} = validateTool(req.body);

   //Return 400 if invalid
   if(error){
       res.status(400).send(error.details[0].message);
       return;
   }

    //Create a new object to add to our tools array
    const tool = {
        id: tools.length +1,
        name: req.body.name
    };

    //Adds the tool to the array
    tools.push(tool);

    //Send the tool back as a response
    res.send(tool);
});

//Create "/:id" UPDATE route
router.put('/:id', (req, res) => {

    //Find the tool
    let tool = tools.find(c => c.id === parseInt(req.params.id));

    //Return a 404 status if not found and send a message
    if(!tool){
        return res.status(404).send('The tool ID was not found!');
    }
    

    //Grab the error part of the object and store it in an object called error
    const {error} = validateTool(req.body);

    //Return 400 if invalid
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    //Update the tool
    tool.name = req.body.name;

    //Return the updated tool to the client
    res.send(tool);

})

//Make ValidateTool function can be reused
function validateTool(tool){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(tool, schema);
}

//Create "/:id" GET route
router.get('/:id', (req, res) => {

    //Find an array and convert it to a int parseInt
    let tool = tools.find(c => c.id === parseInt(req.params.id));

    //Return a 404 status if not found and send a message
    if(!tool) return res.status(404).send('The tool ID was not found!');

    res.send(tool);
});

//Create "/:id" DELETE route
router.delete('/:id', (req, res) => {

    //Find the tool
    let tool = tools.find(c => c.id === parseInt(req.params.id));

    //Return a 404 status if not found and send a message
    if(!tool) return res.status(404).send('The tool ID was not found!');

    //Get the index of the tool
    const index = tools.indexOf(tool);

    // Delete the tool from the array
    tools.splice(index, 1);

    //Return the tool
    res.send(tool);

});

//Export the routes
module.exports = router;