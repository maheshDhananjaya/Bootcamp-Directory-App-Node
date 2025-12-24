const express = require("express");
const {getCourses, getCourse, addCourse, updateCourse, deleteCourse} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);
router.route("/").post(addCourse);
router.route("/:id").get(getCourse);
router.route("/:id").put(updateCourse);
router.route("/:id").delete(deleteCourse);

module.exports = router;