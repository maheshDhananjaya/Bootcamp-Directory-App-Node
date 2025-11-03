const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique:true,
        trim: true,
        maxlength: [50, 'Name cannot be longer than 50 characters']
    }
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);