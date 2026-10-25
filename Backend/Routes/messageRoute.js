import express from "express";
import authmiddleware from "../middleware/authuser.js";
import { chatInitiate, createGroup, getAllChats, getLastMessage, getMessages, getSidebarUsers, markMessageAsSeen, sendMessage } from "../Controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authmiddleware, getSidebarUsers);
messageRouter.get("/chat", authmiddleware, getAllChats);
messageRouter.post("/newchat", authmiddleware, chatInitiate);
messageRouter.get("/last/:id", authmiddleware, getLastMessage);
messageRouter.get("/:id", authmiddleware, getMessages);
messageRouter.put("/mark/:id", authmiddleware, markMessageAsSeen);
messageRouter.post("/send/:id", authmiddleware, sendMessage);
messageRouter.post("/group", authmiddleware, createGroup);

export default messageRouter;