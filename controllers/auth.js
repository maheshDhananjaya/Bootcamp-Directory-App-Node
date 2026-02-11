const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async(req, res) => {
    const { name, email, password,role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    })
  //
  //   const token = user.getSignedJwtToken()
  // res.status(200).json({ success: true, message: "User registered", token });
    sendTokenResponse(user,200,res)
};

exports.login = async(req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({message: "Email or password is required"});
    }
    const user = await User.findOne({email}).select("+password");
    if (!user) {
        return res.status(401).send({message: "account not found"});
    }
    const isPasswordMatch = await user.checkPassword(password)
    if(!isPasswordMatch){
        return res.status(401).send({message: "passwords does not match"});
    }
    // const token = user.getSignedJwtToken()
    // res.status(200).json({ success: true, message: "login is success", token });
    sendTokenResponse(user,200,res)
}

exports.getUser = async(req, res) => {
    const user  = await User.findById(req.user.id);
    if(!user){
        return res.status(401).send({message: "user not found"});
    }
    return res.status(200).send({success:true, data:user});
}

exports.updateUser = async(req, res) => {
    const fieldsToUpdate = {
        email: req.body.email,
        name: req.body.name,
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate,{
        new: true,
        runValidators:true
    })
    res.status(200).send({success:true, data:user});
}

exports.updatePassword = async(req, res) => {
    const user = await User.findById(req.user.id).select("+password");
    console.log("user", user);
    if(!user){
        return res.status(401).send({message: "user not found"});
    }
    if(!await user.checkPassword(req.body.currentPassword)) {
        return res.status(401).send({message: "passwords does not match"});
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user,200,res);
}


exports.forgotPassword = async(req, res) => {
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(401).send({message: "user not found"});
    }
    const resetToken = user.getResetPasswordToken()
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    const message = `reset password link: ${resetUrl}`;

    try{
        await sendEmail({
            email:user.email,
            subject:"Reset Password",
            message
        })
        return res.status(200).send({success:true, data :"email sent"});
    }catch(err){
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})
        return res.status(400).send({success:false, data :"email sent fail"});
    }
}


exports.restPassword = async(req, res) => {
    const resetToken = req.params.resetToken;
    const resetPasswordToken = crypto.createHash("md5").update(resetToken).digest("hex");

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{$gt:Date.now()}});
    if(!user){
        return res.status(401).send({message: "user not found"});
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    await user.save();

    sendTokenResponse(user,200,res);

}

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()
    const options = {
expiresIn: new Date(Date.now() + 30*24*3600 * 1000),
        httpOnly: true,
    }
    res.status(statusCode).cookie("token", token, options).json({success: true, token: token});
}
