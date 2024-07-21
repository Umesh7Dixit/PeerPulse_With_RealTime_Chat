// io is like the circuit board and users are socket means switch
// all users when they are online they connect with io like plug ourself with socket (io)

import { Server } from 'socket.io';
// we need to create a http server
import http from 'http';  //built-in nodeJs module
import express from 'express'; 
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

const app = express(); //1 express instance
const server = http.createServer(app) //2 created http server //now we are able to handle http req

//3 create socket server by binding http server

// const io = new Server(server) //we able to handle any socket request


const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",//react application
        methods: ["GET", "POST"],
    },
});
// server creationcompleted 



// getting the socket id of a user i.e recipientId(userId) we pass the userId as a key so we get the value as a socketId from hashmap
// we get the recipientId from backend messageController.js(controller)
export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId]
}



// now we need to map the userId with socketId in our server so we use hashmap
const userSocketMap = {} //userId : socketId  //empty hashmap




// now listen for any incoming connections or requests
// the argument socket is like user which gonna be connected

// io.on('connection', callback) listens for new client connections.
// The callback(socket) function is executed each time a client connects to the server.
io.on("connection", (socket) => {
    console.log("user connected",socket.id);

    const userId = socket.handshake.query.userId; //we provide the userId in SocketContext.jsx line no.21

    if(userId != "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //it provide the unique key to userId in hashmap(userSocketMap) so it converting them into an array like [1,2,3,4]
// when user connected then we add the userId to the hashmap(userSocketMap) and when it disconnected then we remove the userId from hashmap or update the hashmap 
    

    socket.on("markMessagesAsSeen", async({ conversationId, userId }) => {
        try {//10:48
            await Message.updateMany({ conversationId: conversationId, seen: false} , { $set: { seen: true }});
            await Conversation.updateOne({ _id: conversationId}, { $set: { "lastMessage.seen": true }});
            io.to(userSocketMap[userId]).emit("messagesSeen", {conversationId} );
        } catch(error){
            console.log(error);
        }
    })



    socket.on("disconnect", () =>{
        console.log("user disconnect");
        delete userSocketMap[userId]; //when user disconnect or updated our state
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //need to send this updated array again to client
    })

} );

export {io,server, app};










