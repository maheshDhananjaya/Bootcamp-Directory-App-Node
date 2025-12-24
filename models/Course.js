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
});

CourseSchema.statics.getAverageCost = async function(bootcampId){
const obj = await this.aggregate([
    {
        $match: {bootcamp: bootcampId},
    },
    {
        $group: {
            _id:'$bootcamp',
            averageCost:{$avg:'$tuition'}
        }
    }
])
    try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageCost:obj[0].averageCost,
    });
    }catch(err){
    console.log(err);
    }
}

CourseSchema.post('save', function(){
this.constructor.getAverageCost(this.bootcamp)
});


CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp)
});

module.exports = mongoose.model('Course', CourseSchema);