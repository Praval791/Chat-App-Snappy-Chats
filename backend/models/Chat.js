import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: "string",
      trim: true,
      required: [true, "Please Provide Chat Name"],
      minLength: [3, "Chat Name must be at least 3 characters long"],
      maxLength: [50, "Chat Name must be at most 255 characters long"],
    },
    isGroupChat: {
      type: "boolean",
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please Provide Users Details"],
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupSubAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
