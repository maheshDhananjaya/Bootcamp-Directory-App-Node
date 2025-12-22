const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description:{
        type: String,
        required: [true, 'Description is required'],
    },
    weeks:{
        type: String,
        required: [true, 'Number of Weeks is required'],
    },
    tuition:{
        type: Number,
        required: [true, 'Tuition cost is required'],
    },
    minimumSkill:{
        type:String,
        required: [true, 'Minimum Skill is required'],
        enum:['beginner','intermediate','advanced'],
    },
    scholarShipAvailable:{
        type:Boolean,
        default: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    }
})

module.exports = mongoose.model('Course', CourseSchema);