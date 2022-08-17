import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    default: "FORGOT PASSWORD",
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 7200000 },
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
