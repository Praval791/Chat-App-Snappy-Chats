import mongoose from "mongoose";
const verifyEmailTokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: [true, "Please provide a valid token"],
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 86400000 },
  },
});

export const VerifyEmailToken = mongoose.model(
  "VerifyEmailToken",
  verifyEmailTokenSchema
);
