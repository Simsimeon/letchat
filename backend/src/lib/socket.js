const express = require("express");
const http = require("node:http");
const {Server} = require("socket.io"); 


const app = express();

const server = http.createServer(app);
const configuredFrontendOrigin = process.env.FRONT_END_URL?.trim();
const allowedOrigins = [
    configuredFrontendOrigin,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});
const userSocketMap={}
function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
io.on("connection",(socket)=>{
 const userId = socket.handshake.query.userId;
 if(userId) userSocketMap[userId]=socket.id;

io.emit("getOnlineUsers",Object.keys(userSocketMap));

socket.on("disconnect",()=>{
    if(userId && userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId]
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
})
});

module.exports = {app, server,io,getReceiverSocketId}