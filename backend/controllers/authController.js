import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import { generateRefreshToken, generateAccessToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"
import { ChatRequest } from '../models/requestModel.js'
import { Message } from "../models/messsageModel.js"
import { UserChat } from "../models/userChatModel.js"

export const signInController = async(req, res) => {
    try {
        const { userName, password} = req.body

        //logic to check username is availablein DB or not
        const user = await User.findOne({userName})

        if(!user) {
           return res.status(401).json({
                message: "Invalid username"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });


        // const token = jwt.sign({ userId: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // set to false in dev if needed
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
          });

         user.refreshToken = refreshToken
         await user.save() 

        return res.json(
        { 
            user: {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                  }, 
            message: "login succesful",
            accessToken,
            success: true
        });
        

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
} 

export const signUpController = async(req, res) => {
    try {
        const { userName, password, email} = req.body

        //logic for store id pass in DB
        const userCheck = await User.findOne({ userName })

        if(!userName && !password && !email){
           return res.status(400).json({
                message: "Please enter all details",
                success: false
            })
        }

        if(userCheck){
           return res.status(401).json({
                message: "This username is already exist",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       const user = await User.create({
            userName,
            password: hashedPassword,
            email,
        })

        // const token = jwt.sign( user._id , process.env.JWT_SECRET, {
        //     expiresIn: "1d",
        //   });
        
        //   res.cookie("token", token, {
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        //     httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        //     sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        //     secure: "development",
        //   });
        
         
        return res.status(201).json({
            user,
            success: true
        })

    } catch (error) {
       return res.status(400).json({
        message: `Error ${error}`
        })
    }
} 

//logout
export const signOutController = async(req, res) => {
    try {
        res.clearCookie('refreshToken')

        await User.findOneAndUpdate({refreshToken: req.cookies.refreshToken}, {refreshToken: null} )

        res.json({ message: 'Logged out successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Logout error', error: err.message })
    }
}

// refresh route controler in server
export const refreshController = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });
  
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== token) return res.status(403).json({ message: 'Invalid refresh token' });
  
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken, success: true });
    } catch (err) {
      res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
  };

//upload profile image
export const uploadImageController = async(req,res) => {
    try{
        const {profilePic} = req.body
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
          }

       const uploadImage = await cloudinary.uploader.upload(profilePic)
       const updatedUser = await User.findByIdAndUpdate(userId, 
        { profilePic: uploadImage.secure_url}, {new: true })

        return res.status(201).json({
            updatedUser,
            message: "Profile upload succefully",
            success: true
        })
    }
   catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Upload failed" });
  }
} 

export const chatRequest = async(req, res) => {
    const { senderId, receiverId } = req.body;

  const existing = await ChatRequest.findOne({ sender: senderId, receiver: receiverId });
  if (existing) return res.status(400).json({ message: 'Request already sent', success: false });

  const request = new ChatRequest({ sender: senderId, receiver: receiverId });
  await request.save();

  // Notify receiver via socket
//   io.to(receiverId).emit('chat_request_received', request);

  res.json({ message: 'Request sent', request});
}

export const getChatRequest = async(req, res) => {
try {
  const { userId } = req.params
  const request = await ChatRequest.find({ receiver: userId, status: 'pending' })

  if(!request){
    return res.status(500),json({message: "failed fetching request"})
  }  

  const senderId = request.map(req => req.sender)

  const user = await User.find({_id: { $in: senderId}})
  
  res.json(user)
  
} catch (error) {
  res.status(500).json({message: "Error fetching reques"})
}
}

export const chatRequestAccept = async(req, res) => {
   try {
    const { userId } = req.body;

    const request = await ChatRequest.findOne({sender:userId, receiver: req.user._id});
    if (!request) return res.status(404).json({ message: 'Request not found' });
  
    request.status = 'accepted';
    await request.save();

  
    // // Create chat document
    await UserChat.create({ user: request.sender, friend: request.receiver})
    await UserChat.create({ user: request.receiver, friend: request.sender})
  
  
    // Notify both users
  //   io.to(request.sender.toString()).emit('chat_request_accepted', chat);
  //   io.to(request.receiver.toString()).emit('chat_request_accepted', chat);
  
    res.json({ message: 'Request Accept'  });

   } catch (error) {
    res.status(500).json({message: `request accept error ${error}`})
   }
}

export const chatRequestDecline = async(req, res) => {
    const { userId } = req.body;
  const request = await ChatRequest.findById(userId);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = 'declined';
  await request.save();

  // io.to(request.sender.toString()).emit('chat_request_declined', request);

  res.json({ message: 'Request declined' });

}