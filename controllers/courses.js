const Courses = require('../models/Course');

exports.getCourses = async (req, res) => {
    let query;
    if(req.params.bootcampId){
        query = Courses.find({bootcamp:req.params.bootcampId})
    }else{
        query = Courses.find().populate({
            path: 'bootcamp',
            select: 'name description',
        });
    }
    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });

}

