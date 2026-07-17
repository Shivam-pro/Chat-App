import User from "../Models/userModel.js";
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from "../lib/cloudinary.js";
// register user
export const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        })
        await newUser.save();
        const token = generateToken(newUser._id);
        res.json({ success: true, message: "Your Account created Successfully", user: newUser, token });
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Error in creating user account" });
    }
}

// Function to generate Token for user
const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    return token;
}

// Login User 
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.json({ success: false, message: "User does not exist" });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            res.json({ success: false, message: "Invalid password" });
        }
        const token = generateToken(user._id);
        res.json({ success: true, message: "User Login Successfully", user, token });
    } catch (error) {
        res.json({ success: false, message: "Error in login" });
    }
}

// Update User Profile details
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { returnDocument: "after" });
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePic, {folder: "profile_pics",});
            console.log("Cloudinary upload result: ", upload);
            updatedUser = await User.findByIdAndUpdate(userId, { fullName, profilePic: upload.secure_url, bio }, { returnDocument: "after" });
        }
        res.json({success: true, user: updatedUser});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error, in Update Profile" });
    }
}

//Controller to check if the user is authenticated
export const checkAuth = (req,res) =>{
    res.json({success: true, user: req.user});
}