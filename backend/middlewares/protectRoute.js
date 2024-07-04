import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const protectRoute = async (req,res,next) => {
  try {

    const token = req.cookies.jwt; // jwt is the token name we write it when we generate the token

    if(!token) return res.status(401).json({message:" Unauthorized "})

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password"); //not include password
                                     //the userId is the payload which we gave when we generate token
    req.user = user;

    next();

   
  } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in LogoutUser: ", err.message);
  }
}

export default protectRoute