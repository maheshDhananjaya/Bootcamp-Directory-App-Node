const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load env vars
dotenv.config({path:'./config/config.env'});

// load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

// connect to db
mongoose.connect(process.env.MONGODB_URI, {

});

// read json file
const bootcamp = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const course = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// import into db
const importData = async()=>{
    try{
await Bootcamp.create(bootcamp);
await Course.create(course);
process.exit();
    }
    catch(err){
console.log(err);
    }
}

const deleteData = async()=>{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data deleted successfully.');
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}

console.log(process.argv[2])

if(process.argv[2] === '-d'){
    deleteData();
}else if(process.argv[2] === '-i'){
    importData();
}