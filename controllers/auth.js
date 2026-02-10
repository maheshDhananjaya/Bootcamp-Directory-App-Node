const User = require("../models/User");

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

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken()
    const options = {
expiresIn: new Date(Date.now() + 30*24*3600 * 1000),
        httpOnly: true,
    }
    res.status(statusCode).cookie("token", token, options).json({success: true, token: token});

}
