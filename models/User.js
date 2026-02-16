const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot be longer than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher","admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.getSignedJwtToken =  function(){
    return jwt.sign({id: this.id,name:this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

UserSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getResetPasswordToken =  function(){
    const resetToken = crypto.randomBytes(16).toString("hex");
    this.resetPasswordToken = crypto.createHash("md5").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now()+10*60*1000
    return resetToken;
}

module.exports = mongoose.model("User", UserSchema);
