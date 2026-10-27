import { json } from "express";
import Message from "../Models/messageModel.js";
import User from "../Models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../server.js";
import chatModel from "../Models/chatModel.js";

// Get all users except the logged in user
export const getSidebarUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        res.json({ success: true, users: filteredUsers })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
// Get all user chats
export const getAllChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const allChats = await chatModel.find({ "participant.user": userId }).populate("participant.user", "fullName profilePic bio").populate("lastMessage");
        // Count unseen messages
        const unseenMessages = {};
        const promises = allChats.map(async (chat) => {
            const participant = chat.participant.find(
                (p) => p.user._id.toString() === userId.toString()
            );

            const lastReadAt = participant?.lastReadAt || new Date(0);

            const messageCount = await Message.countDocuments({
                chatId: chat._id,
                senderId: { $ne: userId },
                createdAt: { $gt: lastReadAt }
            });
            if (messageCount > 0) {
                unseenMessages[chat._id] = messageCount;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, chats: allChats, unseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: chatId } = req.params;
        await markRead(chatId, req.user._id);
        const messages = await Message.find({ chatId }).populate("senderId", "fullName profilePic");
        res.json({ success: true, messages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get all messages for selected user
export const getLastMessage = async (req, res) => {
    try {
        const { id: chatId } = req.params;
        const messages = await Message.find({ chatId })
        const lastMessage = messages[messages.length - 1];
        await chatModel.findByIdAndUpdate(chatId, { lastMessage });
        res.json({ success: true, lastMessage });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//API to mark messages as seen using message Id
export const markMessageAsSeen = async (req, res) => {
    await markRead(req.params.id, req.user._id);
    res.json({ success: true });
};

const markRead = async (chatId, userId) => {
    const readAt = new Date();
    const result = await chatModel.updateOne(
        { _id: chatId, "participant.user": userId },
        { $set: { "participant.$.lastReadAt": readAt } }
    );
    if (result.matchedCount) {
        io.to(chatId.toString()).emit("chatRead", {
            chatId: chatId.toString(),
            userId: userId.toString(),
            readAt,
        });
    }
};

//Send message to selected User
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const chatId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            chatId,
            text,
            image: imageUrl,
        })
        await chatModel.findByIdAndUpdate(chatId, { lastMessage: newMessage });

        //Emit the new message to the receiver's socket
        // const receiverSocketId = userSocketMap[receiverId];
        if (chatId) {
            io.to(chatId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const chatInitiate = async (req, res) => {
    const { participant } = req.body;
    const userId = req.user._id;
    try {
        const participatingUserId = participant.find((id) => id.toString() !== userId.toString());
        console.log(participatingUserId);
        const participatingUser = await User.findById(participatingUserId);
        const existingChat = await chatModel.findOne(
            {
                isGroup: false,
                "participant.user": { $all: participant },
                $expr: {
                    $eq: [{ $size: "$participant" }, participant.length]
                }
            }
        ).populate("participant.user", "fullName profilePic bio");
        if (existingChat) {
            return res.json({ success: false, message: "Your are already have a chat with this user, can't create new chat", existingChat });
        }
        const newChat = new chatModel({
            isGroup: false,
            participant: participant.map((id) => ({
                user: id,
                lastReadAt: null
            }))
        });
        await newChat.save();
        // Put any currently-connected participants into the new room
        participant.forEach((id) => {
            const socketId = userSocketMap[id.toString()];
            if (socketId) {
                io.sockets.sockets.get(socketId)?.join(newChat._id.toString());
            }
        });
        const populatedChat = await chatModel
            .findById(newChat._id)
            .populate("participant.user", "fullName profilePic bio");
        res.json({ success: true, chat: populatedChat, user: participatingUser })
    } catch (error) {
        res.json({ success: false, error });
    }
}

export const createGroup = async(req, res)=>{
    try {
        const { name, members, groupImage } = req.body;
        const userId = req.user._id;
        const ids = [...new Set([...(members || []).map(String), userId])];

        let imageUrl = "";

        if(!name?.trim()) return res.json({success: false, message: "Group name is required"});
        if(ids.length < 3) return res.json({success: false, message: "Select at least 2 members"});
        if(await User.countDocuments({_id: {$in: ids}}) !== ids.length) return res.json({success: false, message: "Invalid members"});

        if(groupImage){
            const upload = await cloudinary.uploader.upload(groupImage, {folder: 'group_pics'});
            imageUrl = upload.secure_url;
        }

        const group = await chatModel.create({
            name: name.trim(),
            isGroup: true,
            admin: userId,
            participant: ids.map((id)=>({user: id, lastReadAt: new Date()})),
            groupProfilePic: imageUrl
        })

        const populated = await chatModel.findById(group._id).populate("participant.user", "fullName profilePic bio");

        ids.forEach((id)=>{
            io.in(`user:${id}`).socketsJoin(group._id);
            if(id !== userId) io.to(`user:${id}`).emit("newChat", populated)
        });
        res.json({success: true, chat: populated});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}