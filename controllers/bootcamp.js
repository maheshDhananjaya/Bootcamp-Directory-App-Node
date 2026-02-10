const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const path = require("path");

exports.getAllBootcamps = async (req, res) => {
  const bootcamps = res.advancedResults.data;
  const pagination = res.advancedResults.pagination;
  try {
    res.status(200).json({
      status: "success",
      count: bootcamps.length,
      pagination,
      data: bootcamps,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(404)
        .json({ status: "error", message: "Bootcamp not found" });
    }
    res.status(200).json({ status: "success", data: bootcamp });
  } catch (err) {
    next(err);
    // next(new ErrorResponse(`bootcamp not found with id ${req.params.id}`,404));
    // res.status(500).json({status: 'error', error: err});
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
      req.body.user = req.user.id;
      const publishedBootcamp = await Bootcamp.findOne({user:req.user.id});
      if (publishedBootcamp && req.user.role !=="admin") {
          return res.status(400).json({ status: "error", message: `Bootcamp already exists with this user id ${req.user.id}` });
      }
    const bootcamp = await Bootcamp.create(req.body);
    console.log(bootcamp);
    res.status(200).json({ status: true, data: bootcamp });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.updateBootcamp = async (req, res) => {
  try {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBootcamp) {
      return res
        .status(404)
        .json({ status: "error", message: "Bootcamp not found" });
    }
    res.status(200).json({ status: true, data: updatedBootcamp });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};
exports.deleteBootcamp = async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.getBootcampsInRadius = async (req, res) => {
  try {
    const { zipcode, distance } = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({ status: true, data: bootcamps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.bootcampPhotoUpload = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file;

    //make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    //check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
    //create custom filename
    // file.name = `photo_${bootcamp._id}${file.name.substring(
    //   file.name.lastIndexOf(".")
    // )}`;
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
      await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
      res.status(200).json({ status: true, data: file.name });
    });
  } catch (err) {
    next(err);
  }
};
