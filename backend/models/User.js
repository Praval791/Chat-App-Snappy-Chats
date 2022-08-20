import mongoose from "mongoose";
import bcryptJs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Valid Name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [50, "Name can't be longer than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Provide Email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide Valid Email",
      ],
      unique: [true, "Email already registered"],
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
        default: "anonymous-avatar-icon",
      },
      url: {
        type: String,
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "please Provide a valid phone number"],
      trim: true,
      match: [
        /^\s*(?:\+?(\d{1,3}\s))[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
        "Please Provide a Valid Phone Number",
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    isVerifiedPhoneNumber: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// mongoose middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcryptJs.genSalt(10);
  this.password = await bcryptJs.hash(this.password, salt);
});

userSchema.methods.createToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JET_LIFETIME }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcryptJs.compare(candidatePassword, this.password);
  return isMatch;
};
export const User = mongoose.model("User", userSchema);
