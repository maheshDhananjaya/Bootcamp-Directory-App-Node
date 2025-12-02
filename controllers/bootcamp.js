const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

exports.getAllBootcamps = async (req, res) => {
    try {
        let query;
        let queryStr = JSON.stringify(req.query);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        console.log(queryStr);
        console.log(JSON.parse(queryStr));
        query = Bootcamp.find(JSON.parse(queryStr));

        const bootcamps = await query;
        res.status(200).json({status: "success", count: bootcamps.length, data: bootcamps});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: "error", message: err.message});
    }
}
exports.getBootcampById = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return res.status(404).json({status: 'error', message: 'Bootcamp not found'});
        }
        res.status(200).json({status: 'success', data: bootcamp});
    } catch (err) {
        next(err);
        // next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`,404));
        // res.status(500).json({status: 'error', error: err});
    }
}
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        console.log(bootcamp);
        res.status(200).json({status: true, data: bootcamp});
    } catch (err) {
        console.log(err);
        next(err);
    }
}
exports.updateBootcamp = async (req, res) => {
    try {
        const updatedBootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedBootcamp) {
            return res.status(404).json({status: 'error', message: 'Bootcamp not found'});
        }
        res.status(200).json({status: true, data: updatedBootcamp});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false})
    }
}
exports.deleteBootcamp = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        res.status(200).json({status: true, data: bootcamp});

    } catch (err) {
        res.status(400).json({success: false})
    }
}

exports.getBootcampsInRadius = async (req, res) => {
    try {

        const {zipcode, distance} = req.params;
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        const radius = distance / 3963;
        const bootcamps = await Bootcamp.find({
            location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
        })
        res.status(200).json({status: true, data: bootcamps});
    } catch (err) {
        res.status(500).json({success: false, error: err.message});
    }
}
