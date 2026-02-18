const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");


exports.getReviews = async(req, res) => {
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp:req.params.bootcampId}).populate({
            path: "bootcamp",
            select: "name description",
        });
        if(!reviews) return res.status(404).send("No reviews found!");
        return res.status(200).json({success: true, data: reviews});
    }else{
        const reviews = await  Review.find()
        if(!reviews) return res.status(404).send("No reviews found!");
        return res.status(200).json({success: true, data: reviews});
    }
}

exports.getSingleReview = async (req, res) => {
    const review = await Review.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description",
    })
    if(!review) return res.status(404).send("No reviews found!");
    return res.status(200).json({success: true, data: review});
}

exports.addReview = async (req, res) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootCamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootCamp) return res.status(404).send("No bootcamp found!");

    const review = await Review.create(req.body)
    return res.status(200).json({success: true, data: review});
}
