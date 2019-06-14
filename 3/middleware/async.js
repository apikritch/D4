//Try catch middleware for routes
function asyncMiddleware(handler){
    return async (req, res, next)=> {
        try{
            await handler(req, res);
        }catch(ex){
            next(ex);
        }
    }
}

//Export syncMiddleware module
module.exports = asyncMiddleware;