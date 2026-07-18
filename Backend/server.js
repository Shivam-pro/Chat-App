import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './Routes/userRoute.js';
import messageRouter from './Routes/messageRoute.js';
import { Server } from 'socket.io';

//Create Express App and HTTP server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {};

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User-Connected",  userId);
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnet", ()=>{
        console.log("User-Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

app.use(express.json({limit: "10mb"}));
app.use(cors());
await connectDB();

app.use("/api/status", (req, res)=>{
    res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);


const Port = process.env.PORT || 5000;
server.listen(Port, ()=>{
    console.log(`Server is running on: http://localhost:${Port}`);
})

export default server;