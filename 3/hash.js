//Load bcrypt
const bcrypt = require('bcrypt');

//Create salt
async function run(){

    const salt = await bcrypt.getSalt(10);
    console.log(salt);

    //Hash the password and the salt
    const hashPassword = await bcrypt.hash('password', salt);
    console.log(hashPassword)

}