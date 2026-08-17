const express = require("express");
const http = require("node:http");
const {Server} = require("socket.io"); 


const app = express();

const server = http.createServer(app);
const allowedOrigin= process.env.FRONT_END_URL || "http://localhost:5173"

const io = new Server(server, {cors:{origin:[allowedOrigin]}});
const userSocketMap={}
function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
io.on("connection",(socket)=>{
 const userId = socket.handshake.query.userId;
 if(userId) userSocketMap[userId]=socket.id;

io.emit("getOnlineUsers",Object.keys(userSocketMap));

socket.on("disconnect",()=>{
    if(userId) delete userSocketMap[userId]
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
})
});

module.exports = {app, server,io,getReceiverSocketId}