import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profilePic:{
        type: String,
        default: ""
    },
    socketId:{
        type:String,
        default: null
    },
    refreshToken: String,
},{timestamps:true});

export const User = mongoose.model("User", userSchema);