import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const authmiddleware = async(req, res, next)=>{
    try {
        const token = req.headers.token;
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(token_decoded.userId).select("-password");
        if(!user){
            return res.json({success: false, message: "User not found"});
        }
        req.user = user;
        next()
    } catch (error) {
        return res.json({success: false, message: "Error: In Authentication"});
    }
}

export default authmiddleware;
