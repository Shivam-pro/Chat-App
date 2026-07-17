import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URI).then(()=>{
            console.log("DB connected");
        });
    } catch (error) {
        console.log("Error in DB connection");
    }
}