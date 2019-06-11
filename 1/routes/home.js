//Load express
const express = require('express');
//Load router
const router = express.Router();

//Create "/" GET route 
router.get('/', (req, res) => {
    res.send('Hello world');
});

//Export the routes
module.exports = router;