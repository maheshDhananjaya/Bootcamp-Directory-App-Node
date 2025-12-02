const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message;
    if(err.name ==="CastError"){
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message,404);
    }
    if(err.code === 11000){
        const message = `Bootcamp already exists with name ${err.keyValue.name}`;
        error = new ErrorResponse(message,400);
    }
    if(err.name === "ValidationError"){
         const message = Object.values(err.errors).map((err) => err.message).join(', ');
        error = new ErrorResponse(message,400);
    }
    console.log("err",err)
    res.status(error.statusCode||500).json({success:false,message:error.message||'server error'});
}
module.exports = errorHandler;