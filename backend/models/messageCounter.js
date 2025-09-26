import mongoose from "mongoose";

const messageCounterSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    unseenCounts: {
      type: Map, // key = userId, value = unseen count
      of: Number,
      default: {},
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export const MessageCounter = mongoose.model("MessageCounter", messageCounterSchema);
