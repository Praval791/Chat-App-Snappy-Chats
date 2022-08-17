import { Message } from "../models/Message.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";

const sendMessage = async (req, res) => {
  // const chatId = req.params.chatId;
  const { content, chatId } = req.body;

  var newMessageData = {
    sender: req.user._id,
    chat: chatId,
    content,
  };

  var message = await Message.create(newMessageData);
  message = await message.populate("sender", "-password");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "-password",
  });
  //   message = await User.populate(message, {
  //     path: "chat.groupAdmin",
  //     select: "-password",
  //   });
  //   message = await User.populate(message, {
  //     path: "chat.groupSubAdmins",
  //     select: "-password",
  //   });
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: message,
  });

  res.status(200).json(message);
};

const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "-password")
    .populate("chat");
  res.status(200).json(messages);
};

export { allMessages, sendMessage };
