exports.getAllBootcamps = async (req, res) => {
    res.status(200).json({status: 'success',data:{message: 'get data'}});
}
exports.getBootcampById = async (req, res) => {
    res.status(200).json({status:'success',data:{message: 'get data by id'}});
}
exports.createBootcamp = async (req, res) => {
    res.status(200).json({status: 'success',data:{message: 'create bootcamp'}});
}
exports.updateBootcamp = async (req, res) => {
    res.status(200).json({status: 'success',data:{message: 'update bootcamp'}});
}
exports.deleteBootcamp = async (req, res) => {
    res.status(200).json({status: 'success',data:{message: `delete bootcamp ${req.params.id}`}});
}