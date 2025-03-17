const { Server } = require("socket.io");
const http = require("http");
const express = require('express');
const app = express();
const cors = require('cors');
// const { Socket } = require("dgram");
const server = http.createServer(app);
const io = new Server(server, { 
  cors : { 
      origin:'*',
      methods:['GET','POST']
  }
});

const userIdMap = {};

io.on('connection',(socket)=>{
  console.log(`new user is connected socketTD : ${socket.id}`)

  const userId = socket.handshake.query.userId; // get userId from query
  if(userId) userIdMap[userId] = socket.id; // store userId and socket.id in map

  io.emit("getOnlineUsers",Object.keys(userIdMap)); // send all connected users to all clients
  // // as the map key is userId, we can get all connected users by Object.keys(userIdMap)

  socket.on("disconnect",()=>{
      console.log(`user is disconnected socketID : ${socket.id}`)
      const userId = Object.keys(userIdMap).find(key => userIdMap[key] === socket.id);
      delete userIdMap[userId]; // remove disconnected user from map
      io.emit("getOnlineUsers",Object.keys(userIdMap)); // send all connected users to all clients
  })

  socket.on("join_room",(room)=>{
      socket.join(room);
      console.log("user join room :",room)
  })

  socket.on("new_message",(data)=>{
      // let chat = message.chat;
      //  console.log("Received message:", data);
    // Broadcast the message to everyone in the room (including the sender, if needed)
    io.to(data.room).emit("message_received", data);
  })
})

module.exports = {io,app,server}