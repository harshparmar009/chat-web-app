import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text:{
        type: String,
        require: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    image:{
        type: String,
        default: ''
    },    
},
{timestamps: true})


export const Message = mongoose.model("Message", messageSchema)