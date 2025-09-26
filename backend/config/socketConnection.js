
import { Server } from "socket.io";
import socketAuth from "../middlewares/socketAuth.js";
import { Message } from "../models/messsageModel.js";
import { MessageCounter } from "../models/messageCounter.js";

let io;
const users = new Map(); // Map<userId, socketId>

export function getReceiverSocketId({receiverId, newMessage}) {
  // const checkUser =  users[receiver];
  // if(checkUser){
  //   io.to(checkUser).emit("newMessage", newMessage);
    
  // }
  // else{
  //   console.log("user is not find!");
  // }
  const receiverSocketId = users.get(receiverId);
  const senderSocketId = users.get(newMessage.sender);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receive_message", {
      // from: userId,
      newMessage,
      timestamp: Date.now(),
    });
    io.to(senderSocketId).emit("receive_message", {
      // from: userId,
      newMessage,
      timestamp: Date.now(),
    });
  }

}

export const socketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user?._id?.toString();
    if (!userId) return socket.disconnect();

    console.log(`✅ Socket connected: ${socket.id} [UserID: ${userId}]`);
    users.set(userId, socket.id);
    emitOnlineUsers();

    socket.on("typing", ({receiverId, senderId}) => {
      const receiverSocketId = users.get(receiverId);
      
      if(receiverSocketId){
        io.to(receiverSocketId).emit("typing", {senderId});
      }
     
    });
    
    socket.on("stopTyping", ({receiverId, senderId}) => {
      const receiverSocketId = users.get(receiverId);
      
      if(receiverSocketId){
        io.to(receiverSocketId).emit("stopTyping", {senderId});
      }
    });
    
    // Private messaging
    socket.on("private_message", ({ to, message }) => {
      const receiverSocketId = users.get(to);
      console.log("📥 private_message received:");
    console.log("→ From:", userId);
    console.log("→ To:", to);
    console.log("→ Message:", message);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", {
          from: userId,
          message,
          timestamp: Date.now(),
        });
      }
    });

    // Typing event
    // socket.on("typing", ({ to }) => {
    //   const receiverSocketId = users.get(to);
    //   if (receiverSocketId) {
    //     io.to(receiverSocketId).emit("typing", { from: userId });
    //   }
    // });

    // client emits when chat is opened
  //   socket.on("markMessagesSeen", async ({ chatId, userId }) => {
  //     await Message.updateMany(
  //       { receiver: userId, participants: chatId, seen: false },
  //       { $set: { seen: true } }
  //     );

  // // notify the sender
  //     io.to(chatId).emit("messagesSeen", { chatId, userId });
  //   });

    // Mark messages as seen
  socket.on("markMessagesSeen", async ({ userId, friendId }) => {

      // Update DB
      await Message.updateMany(
        { sender: friendId, receiver: userId, seen: false },
        { $set: { seen: true } }
      );

        const receivedId = friendId
        const senderId = userId

      await MessageCounter.findOneAndUpdate(
        { participants: { $all: [senderId, receivedId] } },
        { $set: { [`unseenCounts.${senderId}`]: 0 } }
      );  

      // Notify the sender that their messages were seen
      io.to(friendId.toString()).emit("messagesSeen", { userId, friendId });
    });

    socket.on("disconnect", () => {
      users.delete(userId);
      console.log(`❌ Socket disconnected: ${socket.id} [UserID: ${userId}]`);
      emitOnlineUsers();
    });
  });
};

const emitOnlineUsers = () => {
  const onlineUserIds = Array.from(users.keys());
  io.emit("online_users", onlineUserIds);
};


export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};
