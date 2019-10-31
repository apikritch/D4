//Load mysql
const Mysql = require('mysql');
//Load express
const express = require('express')
//Load router 
const router = express.Router();

//Create a pool
const pool = Mysql.createPool({
    host: 'localhost',
        user: 'root',
        password: '',
        database: 'node_usersapi',
        port: 3306
})

//Refactored Connection Function
function getConnection(){
    return pool;
}
//Homepage route
router.get('/', async(req, res, next) => {
    //Tell express to render index.pug
    return res.render('index', {page: 'Home'});
});

router.get('/users', (req, res, next) => {
    
    //Connection
    const connection = getConnection();

    //Query
    const queryString = "SELECT * FROM users";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.send(`Something is wrong ${err}`);
            next(new Error(`Something is wrong ${err}`));
        }
        res.json(rows);
    });

});

//Create route to collect POST data
router.post('/user_create', (req, res, next) => {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    //Send data to database
    const connection = getConnection();
    const queryString = "INSERT INTO users (first_Name, last_Name, email, password, confirm_Password) VALUES (?,?,?,?,?)"

    //Pass in query string and values from variables
    connection.query(queryString, [firstName, lastName, email, password, confirmPassword], (err, results, fields) => {

        //Error check
        if(err){
            res.send(`Failed to insert new user: ${err}`);
            res.sendStatus(500);
            next(new Error(`Failed to inset new user: ${err}`));
        }

        //Response
        res.send(`Inserted a new user with id: ${results.insertId}`);

    });

});

//Route for user ID
router.get('/users/:id', (req, res, next) => {

    const userID = req.params.id;

    //MySQL connection
    const connection = getConnection();

    //SQL query and response
    const queryString = "SELECT * FROM users WHERE id=?";
    connection.query(queryString, [userID], (err, rows, fields) => {

        if(err){

            res.send(`Something is wrong ${err}`);
            res.sendStatus(500);
            next(new Error(`Something is wrong ${err}`));

        }

        //Change the JSON format
        const users = rows.map((rows) => {

            return {firstName: rows.first_name, lastName: rows.last_name, email: rows.email};

        });

        res.json(users);

    });

});

//Export router
module.exports = router;