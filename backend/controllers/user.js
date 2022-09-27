import crypto from "crypto";
import cloudinary from "cloudinary";
import { config } from "dotenv";

import mailTransporter from "../config/mailTransporter.js";

import { User } from "../models/User.js";
import { VerifyEmailToken } from "../models/VerifyEmailToken.js";

import UnauthenticatedError from "../errors/unauthenticated.js";
import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import ForbiddenRequestError from "../errors/forbidden-request.js";
import { OTP } from "../models/OTP.js";

config();

const signup = async (req, res) => {
  let { name, email, password, phoneNumber, avatar } = req.body;

  if (!name || !email || !password || !phoneNumber)
    throw new BadRequestError("Please Enter all The Required Fields");

  const userExists = await User.findOne({ email });
  if (userExists) throw new BadRequestError("User already exists");

  if (!avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(
      process.env.DEFAULT_AVATAR,
      {
        folder: "Chat-App",
      }
    );
    req.body.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  } else {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "Chat-App",
    });
    req.body.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  let user = await User.create({ ...req.body });

  if (!user) throw new Error(`Unable to create user.Please try again later!`);
  const token = user.createToken();
  user = user.toObject();
  delete user.password;
  res.status(201).json({ user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password both");
  }
  let user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User doesn't exists");
  }

  // compare the password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials (wrong Password)");
  }

  const token = user.createToken();
  user = user.toObject();
  delete user.password;
  res.status(200).json({ user, token });
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json({ totalUsers: users.length, users });
};

const sendVerificationEmail = async (req, res) => {
  const user = req.user;
  if (user.isVerifiedEmail)
    throw new BadRequestError(
      `User with Email:${user.email} is already verified`
    );
  await VerifyEmailToken.findOneAndRemove({ _userId: user._id });
  const token = await VerifyEmailToken.create({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  if (!token)
    throw new Error(
      "Unable to create Email verification link, Please try again later!"
    );
  const date = new Date(
    token.expireAt.getTime() + 86400000
  ).toLocaleDateString();
  const time = token.expireAt.toLocaleTimeString();

  const mailOptions = {
    from: `Snappy chat <${process.env.ADMIN_EMAIL}>`,
    to: user.email,
    subject: "Account Verification",
    html: `<h2>Hello ${user.name}</h2>
            <p>Please verify your account by clicking the link:</p>
            <span style="margin:0 10px 0 10px" >👉🏼</span><a href="http://${req.headers.host}/api/v1/user/verify/email/confirmation/${user.email}/${token.token}" target="_blank">Click Here</a><span style="margin:0 10px 0 10px" >👈🏼</span>
            <br>
            <p>This Link will be expired on <b>${date}</b> at <b>${time}</b></p>
            `,
  };
  mailTransporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json({ text: err.message });
    } else {
      res.status(200).json({
        text:
          "A verification email has been sent to " +
          user.email +
          `. Please Check Your Spam Folder and If you not get verification Email then click on resend token.`,
        expireAt: {
          date,
          time,
        },
      });
    }
  });
};

const reSendVerificationEmail = async (req, res) => {
  const user = req.user;
  if (user.isVerifiedEmail)
    throw new BadRequestError(
      `User with Email:${user.email} is already verified`
    );
  var token = await VerifyEmailToken.findOne(user._id);
  if (!token) {
    token = await VerifyEmailToken.create({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
  }

  if (!token)
    throw new Error(
      "Unable to create Email verification link, Please try again later!"
    );
  const date = new Date(
    token.expireAt.getTime() + 86400000
  ).toLocaleDateString();
  const time = token.expireAt.toLocaleTimeString();

  const mailOptions = {
    from: `Snappy chat <${process.env.ADMIN_EMAIL}>`,
    to: user.email,
    subject: "Account Verification",
    html: `<h2>Hello ${user.name}</h2>
            <p>Please verify your account by clicking the link:</p>
            <span style="margin:0 10px 0 10px" >👉🏼</span><a href="http://${req.headers.host}/api/v1/user/verify/email/confirmation/${user.email}/${token.token}" target="_blank">Click Here</a><span style="margin:0 10px 0 10px" >👈🏼</span>
            <br>
            <p>This Link will be expired on <b>${date}</b> at <b>${time}</b></p>
            `,
  };

  mailTransporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json({ text: err.message });
    } else {
      res.status(200).json({
        text:
          "A verification email has been sent to " +
          user.email +
          `. Please Check Your Spam Folder and If you not get verification Email then click on resend token.`,
        expireAt: {
          date,
          time,
        },
      });
    }
  });
};

const confirmVerificationEmail = async (req, res) => {
  const token = await VerifyEmailToken.findOne({ token: req.params.token });
  if (!token)
    throw new BadRequestError(
      `This link is Note Valid. Verification link may have expired.`
    );

  let user = await User.findById(token._userId);

  if (!user) throw new UnauthenticatedError();

  if (user.isVerifiedEmail)
    throw new BadRequestError(
      `User with Email:${user.email} is already verified`
    );

  user.isVerifiedEmail = true;
  user.save((err, user) => {
    if (err) return new Error(`Unable to verify user`);
  });

  await VerifyEmailToken.findOneAndRemove({ _userId: user._id });

  res.status(200).json({ text: "Your account has been successfully verified" });
};

const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError(`User with email ${email} doesn't exist`);
  if (!user.isVerifiedEmail)
    throw new ForbiddenRequestError(
      `User isn't verified yet. To change your forgotten password, please verify your email first!`
    );

  const data = {
    _userId: user._id,
    token: Math.floor(100000 + Math.random() * 900000),
  };

  await OTP.findOneAndRemove({ _userId: user._id });
  const otp = await OTP.create(data);
  if (!otp) throw new Error(`Unable to generate OTP.Please try again later!`);

  const date = new Date(
    new Date(otp.expireAt).getTime() + 7200000
  ).toLocaleDateString();
  const time = new Date(
    new Date(otp.expireAt).getTime() + 7200000
  ).toLocaleTimeString();

  const mailOptions = {
    from: `Snappy chat <${process.env.ADMIN_EMAIL}>`,
    to: user.email,
    subject: "Forgot Password",
    html: `<h2>Hello ${user.name}</h2>
        <p>Here is your (ONE TIME PASSWORD)OTP to change your forgotten password:</p>
        <span style="margin:0 10px 0 10px" >👉🏼</span><b style="letter-spacing: 2px;">${otp.token}</b><span style="margin:0 10px 0 10px" >👈🏼</span>
        <br>
        <p>This token will be expired on <b>${date}</b> at <b>${time}</b></p>
        `,
  };

  mailTransporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json({ text: err.message });
    } else {
      res.status(200).json({
        text: `One time password has been sent Successfully!. Please Check Your Spam Folder and If you not get otp then click on resend otp.`,
        expireAt: {
          date,
          time,
        },
        email,
      });
    }
  });
};

const reSendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError(`User with email ${email} doesn't exist`);
  if (!user.isVerifiedEmail)
    throw new ForbiddenRequestError(
      `User isn't verified yet. To change your forgotten password, please verify your email first!`
    );

  const data = {
    _userId: user._id,
    token: Math.floor(100000 + Math.random() * 900000),
  };

  var otp = await OTP.findOne({ _userId: user._id });
  if (!otp) otp = await OTP.create(data);
  if (!otp) throw new Error(`Unable to generate OTP.Please try again later!`);
  const date = new Date(
    new Date(otp.expireAt).getTime() + 7200000
  ).toLocaleDateString();
  const time = new Date(
    new Date(otp.expireAt).getTime() + 7200000
  ).toLocaleTimeString();

  const mailOptions = {
    from: `Snappy chat <${process.env.ADMIN_EMAIL}>`,
    to: user.email,
    subject: "Forgot Password",
    html: `<h2>Hello ${user.name}</h2>
        <p>Here is your (ONE TIME PASSWORD)OTP to change your forgotten password:</p>
        <span style="margin:0 10px 0 10px" >👉🏼</span><b style="letter-spacing: 2px;">${otp.token}</b><span style="margin:0 10px 0 10px" >👈🏼</span>
        <br>
        <p>This token will be expired on <b>${date}</b> at <b>${time}</b></p>
        `,
  };

  mailTransporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).json({ text: err.message });
    } else {
      res.status(200).json({
        text: `One time password has been sent Successfully!. Please Check Your Spam Folder and If you not get otp then click on resend otp.`,
        expireAt: {
          date,
          time,
        },
        email,
      });
    }
  });
};

const verifyForgotPasswordOtp = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token) throw new BadRequestError("Please Provide token");
  if (!email || !password)
    throw new BadRequestError("Please Provide email and password");

  var user = await User.findOne({ email });
  if (!user) throw new NotFoundError(`User with email ${email} doesn't exist`);
  if (!user.isVerifiedEmail)
    throw new ForbiddenRequestError(
      `User isn't verified yet. To change your forgotten password, please verify your email first!`
    );
  const otp = await OTP.findOne({
    token,
    _userId: user._id,
  });
  if (!otp)
    throw new BadRequestError(
      "This OTP is Note Valid. Your OTP may have expired."
    );

  user.password = password;
  user.save((err, user) => {
    if (err)
      return new Error(`Unable to change user's password to ${password}`);
  });
  await OTP.findOneAndRemove({ _userId: user._id });
  res.status(200).json({
    text: "Password changed successfully",
  });
};

const updateAvatar = async (req, res) => {
  var { avatar } = req.body;
  if (!avatar.public_id)
    throw new BadRequestError("Please Provide avatar public_id");
  if (!avatar.url) throw new BadRequestError("Please Provide avatar data url");

  const { result } = await cloudinary.v2.uploader.destroy(avatar.public_id);
  if (result === "not found")
    throw new BadRequestError("Please provide correct public_id");
  if (result !== "ok")
    throw new Error(
      "Unable to update user Avatar, The public_id might not exist in database."
    );

  const myCloud = await cloudinary.v2.uploader.upload(avatar.url, {
    public_id: avatar.public_id,
  });
  avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true }
  );

  if (!user) throw new Error("Unable to update user Avatar, Try again later");
  res.status(200).json({
    avatar: user.avatar,
    status: "success",
    text: "User's Avatar update successfully!",
  });
};

const updateName = async (req, res) => {
  const { name } = req.body;
  if (!name) throw new BadRequestError("Please Provide new Name");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true }
  );

  if (!user) throw new Error("Unable to update User's Name, Try again later");

  res.status(200).json({
    name: user.name,
    status: "success",
    text: "User's Name update successfully!",
  });
};

const updateEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequestError("Please Provide new Email");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { email, isVerifiedEmail: false },
    { new: true }
  );

  if (!user) throw new Error("Unable to update user Email, Try again later");

  res.status(200).json({
    email: user.email,
    isVerifiedEmail: user.isVerifiedEmail,
    status: "success",
    text: "User's Email update successfully!",
  });
};

const updatePhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) throw new BadRequestError("Please Provide new PhoneNumber");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { phoneNumber, isVerifiedPhoneNumber: false },
    { new: true }
  );

  if (!user)
    throw new Error("Unable to update user PhoneNumber, Try again later");

  res.status(200).json({
    phoneNumber: user.phoneNumber,
    isVerifiedPhoneNumber: user.isVerifiedPhoneNumber,
    status: "success",
    text: "User's Phone-Number update successfully!",
  });
};

export {
  signup,
  login,
  allUsers,
  sendVerificationEmail,
  confirmVerificationEmail,
  reSendVerificationEmail,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  reSendForgotPasswordOtp,
  updateAvatar,
  updateName,
  updateEmail,
  updatePhoneNumber,
};
