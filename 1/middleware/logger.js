//Logger function
function log(req, res, next){
    console.log('Log every request');
    next();
}

//Export the logger function
module.exports = log;