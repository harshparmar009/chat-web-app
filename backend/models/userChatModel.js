import mongoose from "mongoose";

const userChatSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },    
},
{timestamps: true})


export const UserChat = mongoose.model("UserChat", userChatSchema)