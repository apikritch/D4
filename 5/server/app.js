//Load path module
const path = require('path');
//Load router 
const router = require('./routes/user.js');
//Load body parser
const bodyParser = require('body-parser')
//Load mysql
const Mysql = require('mysql');
//Load express
const express = require('express');

const app = express();

//Set View Engine
app.set('view engine', 'pug');

//Location to look for pug template
app.set('views', path.join(__dirname, './views'));

//Pretty HTML
if(app.get('env')==='development'){
    app.locals.pretty = true;
};
//Access public assests
app.use(express.static('public'));

//To support JSON-encoded bodies
app.use(bodyParser.json());
//To support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: false
}))

//Use router
app.use(router);

app.get('/', (req, res, next) => {
    res.send("Homepage");
});

app.listen(3000, () => {
    console.log('The server is listening on port 3000')
})