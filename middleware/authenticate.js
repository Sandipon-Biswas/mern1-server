const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');


const authenticate = async (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        const verifyToken=jwt.verify(token,process.env.KEY)
        const rootUser =await User.findOne({_id:verifyToken._id,"tokens.token": token});
        if (!rootUser) {
            throw new Error("User not foun")
        }
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
    } catch (error) {
        res.status(401).send("unauthorized: no token provided")
        console.log(error);
    }
}
module.exports=authenticate;




