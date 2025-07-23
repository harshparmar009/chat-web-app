import cloudinary from '../lib/cloudinary.js'
import { User } from "../models/userModel.js"
import { getReceiverSocketId } from "../config/socketConnection.js"
import { Message } from "../models/messsageModel.js"

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
      const sender = req.user._id;
  
      let imageUrl;
      if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        sender,
        receiver: receiverId,
        text,
        image: imageUrl,
      });
  
      await newMessage.save();
  
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