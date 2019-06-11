//Authentication function
function auth(req, res, next){
    console.log('Authenicating...');
    next();
}

//Export the authentication function
module.exports = auth;