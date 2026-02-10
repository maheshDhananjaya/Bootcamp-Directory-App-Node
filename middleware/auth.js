const jwt = require('jsonwebtoken');
const User = require("../models/User");

exports.protect = async (req, res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // if(req.cookies && req.cookies.access_token) {
    //     token = req.cookies.access_token.split(' ')[1];
    // }
    if(!token) {
        return res.status(401).send({"error": "No token provided!"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded",decoded);
        req.user = await User.findById(decoded.id);
        next();
    }catch(err){
        return res.status(401).send({"error": "No token provided"});
    }
}

exports.authorize = (roles)=>{
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(401).send(`the role ${req.user.role} is not authorized`)
        }
        next();
    }

}
