import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Provide Sender"],
    },
    content: {
      type: String,
      max: [2000, "Message can't be longer than 2000 characters"],
      trim: true,
      required: [true, "Please provide Message"],
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Please Provide Chat Details"],
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
