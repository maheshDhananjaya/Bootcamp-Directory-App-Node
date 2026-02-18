const express = require("express");
const {
  getAllBootcamps,
  getBootcampById,
  updateBootcamp,
  createBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");

const Bootcamp = require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");
const {protect,authorize} = require("../middleware/auth");

const courseRouter = require("./courses");
const reviewRouter = require("./review");

const router = express.Router();

router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/").get(advancedResults(Bootcamp, "courses"), getAllBootcamps);
router.route("/").post(protect,createBootcamp);
router.route("/:id").get(getBootcampById);
router.route("/:id").put(updateBootcamp);
router.route("/:id").delete(deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/:id/photo").put(bootcampPhotoUpload);

module.exports = router;
