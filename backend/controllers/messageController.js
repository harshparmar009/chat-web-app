import cloudinary from '../lib/cloudinary.js'
import { User } from "../models/userModel.js"
import { getReceiverSocketId } from "../config/socketConnection.js"
import { Message } from "../models/messsageModel.js"
import { UserChat } from '../models/userChatModel.js'
import { MessageCounter } from '../models/messageCounter.js'

// const io = getIO()

export const getAllUsers = async(req, res) => {

    try {
        const userId = req.user._id

        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password")

       
     return res.status(201).json({users: filteredUsers})
    } catch (error) {
        console.log("fetch filter users error:", error);
        
        res.status(500).json({success: false, message: "can not find users"})
    }

}

export const getAcceptedUsers = async(req, res) => {
  try {
    const userId = req.user._id

    // const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password")

    const filteredUsers = await UserChat.find({user: userId})
    const newFilteredUsers = filteredUsers.map(req => req.friend)

    const allUsers = await User.find({_id: newFilteredUsers}).select("-password")

 return res.status(201).json({users: allUsers})
} catch (error) {
    console.log("fetch filter users error:", error);
    
    res.status(500).json({success: false, message: "can not find users"})
}

}

export const getMessages = async (req, res) => {
    try {
      const { id: receiverId  } = req.params;
      const senderId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId  },
          { sender: receiverId , receiver: senderId },
        ],
      }).sort({ createdAt: 1 }); // oldest first
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Couldn't fetch users chat" });
    }
  };
  
  export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      let imageUrl;
      if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();

       // Update chat counter
    let chat = await MessageCounter.findOneAndUpdate(
      { participants: { $all: [senderId, receiverId] } },
      {
        $set: { lastMessage: newMessage._id },
        $inc: { [`unseenCounts.${receiverId}`]: 1 },
      },
      { new: true }
    );

    // If chat doesn’t exist, create it
    if (!chat) {
      chat = await MessageCounter.create({
        participants: [senderId, receiverId],
        lastMessage: newMessage._id,
        unseenCounts: { [receiverId]: 1 },
      });
    }
  
      getReceiverSocketId({receiverId, newMessage});
      // if (receiverSocketId) {
      //   io.to(receiverSocketId).emit("newMessage", newMessage);
      // }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const messageCounter = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const chats = await MessageCounter.find({ participants: userId })
        .populate("participants", "userName profilePic")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });
  
      const formatted = chats.map((chat) => {
        const friend = chat.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );
  
        const unseenCount = chat.unseenCounts.get
          ? chat.unseenCounts.get(userId.toString()) || 0
          : chat.unseenCounts[userId.toString()] || 0;
  
        return {
          _id: chat._id,
          friend,
          unseenCount,
          lastMessage: chat.lastMessage,
        };
      });
  
      res.json(formatted);
    } catch (error) {
      console.error("Error in messageCounter controller:", error.message);
      res.status(500).json({ error: "Couldn't fetch chats" });
    }
  };
  