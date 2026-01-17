const Courses = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

exports.getCourses = async (req, res) => {
  if (req.params.bootcampId) {
    const course = await Courses.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: course.length,
      data: course,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
};

exports.getCourse = async (req, res) => {
  const course = await Courses.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
  res.status(200).json({
    success: true,
    data: course,
  });
};

exports.addCourse = async (req, res) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootCamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootCamp) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
  const course = await Courses.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
};

exports.updateCourse = async (req, res) => {
  let course = await Courses.findById(req.params.id);
  if (!course) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
};

exports.deleteCourse = async (req, res) => {
  const course = await Courses.findByIdAndDelete(req.params.id);
  console.log("course", course);
  if (!course) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
  res.status(200).json({
    success: true,
    message: "Successfully Deleted",
  });
};
