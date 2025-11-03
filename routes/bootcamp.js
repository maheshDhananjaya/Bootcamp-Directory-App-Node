const express = require('express');
const {getAllBootcamps, getBootcampById, updateBootcamp, createBootcamp, deleteBootcamp} = require("../controllers/bootcamp");

const router = express.Router();

router.route("/").get(getAllBootcamps);
router.route("/").post(createBootcamp);
router.route("/:id").get(getBootcampById);
router.route("/:id").put(updateBootcamp);
router.route("/:id").delete(deleteBootcamp);

module.exports = router;