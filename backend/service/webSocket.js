// socket.js
const { Server } = require("socket.io");
const User = require("../models/user.model");

const userSocketMap = {};

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      //   origin: ,
      origin: ["https://chitchat-arif.vercel.app", "http://localhost:3000"], // your frontend origin
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("registerUserMap", async (userId) => {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} mapped to socket ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error(
      "Socket.io not initialized! Call initSocket(server) first.",
    );
  }
  return io;
}

function getSocketId(userId) {
  return userSocketMap[userId];
}

module.exports = { initSocket, getIO, getSocketId };
