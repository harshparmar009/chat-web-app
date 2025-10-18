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
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    socketId:{
        type:String,
        default: null
    },
    refreshToken: String,

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
},{timestamps:true});

export const User = mongoose.model("User", userSchema);