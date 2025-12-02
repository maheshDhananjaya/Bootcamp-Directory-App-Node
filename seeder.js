const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load env vars
dotenv.config({path:'./config/config.env'});

// load models
const Bootcamp = require('./models/Bootcamp');

// connect to db
mongoose.connect(process.env.MONGODB_URI, {

});

// read json file
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// import into db
const importData = async()=>{
    try{
await Bootcamp.create(bootcamp);
process.exit();
    }
    catch(err){
console.log(err);
    }
}

const deleteBootcamp = async()=>{
    try{
        await Bootcamp.deleteMany();
        console.log('Bootcamp deleted successfully.');
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}

console.log(process.argv[2])

if(process.argv[2] === '-d'){
    deleteBootcamp();
}else if(process.argv[2] === '-i'){
    importData();
}