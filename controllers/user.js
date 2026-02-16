const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        return res.status(200).json({message:"success",count:users.length, data:users});
    }catch(err){
        console.log(err);
        return res.status(400).json({message:"error",data:err});
    }
}

exports.getUser = async(req,res)=>{
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message:"not found"});
    }
    return res.status(200).json({message:"success", data:user});
}

exports.updateUser = async(req,res)=>{
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, req.body,{
        new: true,
        runValidators: true
    })
    if(!user){
        return res.status(404).json({message:"not found"});
    }
    return res.status(200).json({message:"success", data:user});
}
exports.deleteUser = async(req,res)=>{
    const userId = req.params.id;
    await User.findByIdAndDelete(userId)
    return res.status(200).json({message:"success",data:{}});
}