//Load mongoose
const mongoose = require('mongoose')

//Connect returns a promise 
mongoose.connect('mongodb://localhost:37017/rentool', { useNewUrlParser: true }).then(()=>{
    console.log('connected');
}).catch(err => console.error('connection failed', err));

//Schema
//Define the structure of documents
const productSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 255},
    owner: {type: String, required: true, minlength:2, maxlength: 255},
    category: {
        type: String,
        enum: ['tools', 'safty', 'test & measure'],
        required: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required:true,
        min:1,
        max:10,
        get: value => Math.round(value),
        set: value => Math.round(value)
    },
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(array, callback){
                setTimeout(() => {
                    const result = array && array.length > 0;
                    callback(result);
                }, 4000);
            },
            message: 'Each product must have at least 1 tag'
        }
    },
    date: {type: Date, default: Date.now},
    isVIP: Boolean,
    level: {type: Number, required: function(){return this.isVIP;}}
});

//Model
//Convert the Schema to a class
const Product = mongoose.model('Product', productSchema);
//Populate the object with data
async function createProduct(){
    const product = new Product({
        name: 'Drill',
        owner: 'Johnie',
        category: 'tools',
        age: 3.5,
        tags: ['electric drill','cordless drill','drill'],
        isVIP: true,
        level: 1
    });

    try{
        //Save the data
        const result = await product.save();
        console.log(result);
    }catch(ex){
        console.log(ex.message);
        //Get out each errors object
        for(field in ex.errors){
            console.log(ex.errors[field].message);
        }
    }


}

//Call createProduct function
createProduct();

//Create an async function to get documents
async function getProducts(){

    const pageNumber = 2;
    const pageSize = 10;
    const products = await Product
    .find({owner:/.*John*./i})
    .skip((pageNumber - 2) * pageSize)
    .limit(pageSize)
    .sort({name : 1})
    .countDocuments();
    console.log(products);
}

//Call getProducts function
//getProducts();

//Create an async function to update documents
async function updateProduct(id){
    //Find the document with the matching ID
    const product = await Product.update({_id: id}, {
        $set: {
            owner: 'Marilou Fisher',
            isVIP: true
        }
    });

    console.log(result);
}

//Find an ID from the database and pass it into updateCourse();
//updateProduct('5cffc88afca2921bc4841ecc');

//Create an async function to delete documents
async function removeProduct(id){

    //Find the document and pass in the id of the object we want to delete
    const result = await Product.deleteOne({_id: id});
    console.log(result);
}

//Call removeProduct function
//removeProduct('5cffc88afca2921bc4841ecc');