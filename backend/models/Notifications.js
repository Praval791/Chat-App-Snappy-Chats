import mongoose from "mongoose";
const notificationsSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please Provide User id"],
    unique: [true, "User id must be unique"],
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      unique: true,
    },
  ],
});

export const Notifications = mongoose.model(
  "Notifications",
  notificationsSchema
);
