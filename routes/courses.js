const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");
const {protect,authorize} = require("../middleware/auth");

router.route("/").get(
  advancedResults(Course, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);
router.route("/").post(protect,authorize(["publisher"]),addCourse);
router.route("/:id").get(getCourse);
router.route("/:id").put(updateCourse);
router.route("/:id").delete(deleteCourse);

module.exports = router;
