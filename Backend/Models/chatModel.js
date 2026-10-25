import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    groupProfilePic: {
        type: String,
        default: ""
    },
    participant: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            lastReadAt: {
                type: Date,
                default: null
            }
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const chatModel = mongoose.model("ChatModel", chatSchema);

export default chatModel;