//Load config
const config = require('config');
//Load jsonwebtoken
const jwt = require('jsonwebtoken');

//Middleware for verifying token
function auth(req, res, next){

    //Sent the user token in the http header
    const token = req.header('x-auth-token');
    if(!token){
        //Return 401 if no token in header property
        return res.status(401).send('Access Denied! No token provided');
    }

    try{
        //Decode the token
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        //Store the decoded token in the req
        req.user = decoded;
        //Call next() middle ware
        next();
    }

    catch(ex){
        //Throw an exception if the token is not valid
        res.status(400).send('Invalid token.');
    }

}

//Export middleware
module.exports = auth;