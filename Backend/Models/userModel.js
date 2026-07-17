import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true, minlength: 6},
    profilePic: {type: String, default: ""},
    bio: {type: String, default: "Hey Iam using Zap Chat"},
},{timestamps: true})

const User = mongoose.model("User", userSchema);
export default User;