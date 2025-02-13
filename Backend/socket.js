const { Server } = require("socket.io");
const http = require("http");
const express = require('express');
const app = express();
const cors = require('cors');
const { Socket } = require("dgram");
const server = http.createServer(app);
const io = new Server(server, { 
  cors : {
      origin:'*',
      methods:['GET','POST']
  }
});

io.on('connection',(socket)=>{
  console.log(`new user is connected socketTD : ${socket.id}`)

  socket.on("join_room",(room)=>{
      socket.join(room);
      console.log("user join room :",room)
  })

  socket.on("new_message",(message)=>{
      let chat = message.chat;
  })
})

module.exports = {io,app,server}