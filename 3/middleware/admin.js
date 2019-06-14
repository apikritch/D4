//Create admin middleware function
function admin(req, res, next){

    //Check if user is admin
    if(!req.user.isAdmin){
        return res.status(403).send('Access denied');
    }
    next();

}

//Export middleware
module.exports = admin;