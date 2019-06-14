//Load winston
const winston = require('winston');
//Require winston-mongodb
require('winston-mongodb');

//Create a new logger object
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'My App' },
    transports: [
       
        //Write all logs error to `error.log
        new winston.transports.File({ filename: 'logs/error.log',  level: 'error' }),
        //Send anything above warning
        new winston.transports.File({ filename: 'logs/warnings.log', level: 'warn' }),
        //Everything here
        new winston.transports.File({ filename: 'logs/combined.log' }),
        //Save error to database
        new winston.transports.MongoDB({db: 'mongodb://localhost:37017/rentool'})
    ]
});

//Takes any error from any previous middleware function
function error(err, req, res, next){

    //Pass in the err.message and the err object
    logger.error(err.message, err);

    res.status(500).send('Something failed.');
}

//Listens for any uncaughtException
process.on('uncaughtException', (ex) =>{
    console.log('An uncaught exception occurred ');
    logger.error(ex.message, ex);
});

//Catch any unhandled async code errors and also any Unhandled rejections
process.on('unhandledRejection', (ex) =>{
    console.log('An uncaught rejection occurred ');
    logger.error(ex.message, ex);
});

//Export module
module.exports = error;