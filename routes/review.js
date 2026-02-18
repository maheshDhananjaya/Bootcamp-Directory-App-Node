const express = require('express');

const {protect, authorize} = require("../middleware/auth");
const {getReviews, getSingleReview, addReview} = require("../controllers/review");

const router = express.Router({mergeParams:true});

router.get("/",protect,getReviews)
router.get("/:id",protect,getSingleReview)
router.post("/",protect,authorize(["admin","user"]),addReview)

module.exports = router;
