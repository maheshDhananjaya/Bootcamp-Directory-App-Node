const express = require('express');
const {getAllBootcamps, getBootcampById, updateBootcamp, createBootcamp, deleteBootcamp, getBootcampsInRadius} = require("../controllers/bootcamp");

const courseRouter = require("./courses")

const router = express.Router();

router.use('/:bootcampId/courses',courseRouter);

router.route("/").get(getAllBootcamps);
router.route("/").post(createBootcamp);
router.route("/:id").get(getBootcampById);
router.route("/:id").put(updateBootcamp);
router.route("/:id").delete(deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;