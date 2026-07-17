import express from "express";
import authmiddleware from "../middleware/authuser.js";
import { getMessages, getSidebarUsers, markMessageAsSeen, sendMessage } from "../Controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", authmiddleware, getSidebarUsers);
messageRouter.get("/:id", authmiddleware, getMessages);
messageRouter.put("/mark/:id", authmiddleware, markMessageAsSeen);
messageRouter.post("/send/:id", authmiddleware, sendMessage);

export default messageRouter;