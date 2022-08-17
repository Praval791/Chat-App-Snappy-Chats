import AlreadyExistsError from "../errors/already-exist-error.js";
import BadRequestError from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";

import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
// use to create a one on one chat
const accessChat = async (req, res) => {
  // currently logged in user will send us a userid whom with he want to start a new chat
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequestError(
      `Please provide a user-id whom with you want to start a new chat`
    );
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // populate isChat with the details of sender in latestMessage
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "-password",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    // If chat isn't preExist then create one
    var chatData = {
      chatName: "sender",
      isGroupChat: "false",
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      // Since we just created the chat that means there is no latestMessage apart from this
      res.status(200).json(fullChat);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "-password",
  });
  res.status(200).json({ totalChats: chats.length, chats });
};

const createGroupChat = async (req, res) => {
  // TODO: check that user is valid or not
  let { chatName, users } = req.body;
  users = JSON.parse(users);
  if (!chatName || !users)
    throw new BadRequestError(
      `Please provide a Chat-Name and list of users to create a Group-Chat`
    );
  if (users.length < 2)
    throw new BadRequestError(
      `There must be at least 2 users to create a Group-Chat`
    );
  users.push(req.user);

  const groupChat = await Chat.create({
    chatName: req.body.chatName,
    users,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });
  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password");
  res.status(200).json(fullGroupChat);
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const isGroupChat = await Chat.findById(chatId);
  if (!isGroupChat?.isGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  if (isGroupChat?.groupAdmin._id + "" != req.user._id + "") {
    throw new BadRequestError(`Only Admins can rename the group`);
  }

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password");
  if (!updatedGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  res.status(200).json(updatedGroupChat);
};

const addToGroup = async (req, res) => {
  let { chatId, users: newUsers } = req.body;
  const GroupChat = await Chat.findById(chatId);
  if (!GroupChat?.isGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  if (
    GroupChat?.groupAdmin._id + "" !== req.user._id + "" &&
    !GroupChat?.groupSubAdmins.includes(req.user._id)
  ) {
    throw new BadRequestError(
      `Only Admin or Sub-Admins can add users in group`
    );
  }

  newUsers = JSON.parse(newUsers);
  let users = [];
  newUsers.forEach((userId) => {
    if (!GroupChat.users.find((e) => e == userId)) users.push(userId);
  });
  if (!users || users.length <= 0) {
    let message = {
      text: `Some of the users are already exist is group and There must be at least 1 users that do not exist in this Group-Chat`,
      existUsers: newUsers,
    };
    throw new BadRequestError(message);
  }
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: {
          $each: users,
        },
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password");
  if (!updatedGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  res.status(200).json(updatedGroupChat);
};

const removeFromGroup = async (req, res) => {
  let { chatId, users: deleteUsers } = req.body;
  const GroupChat = await Chat.findById(chatId);
  // if chat isn't a group chat
  if (!GroupChat?.isGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  // if logged user is not a admin or sub-admin
  if (
    GroupChat?.groupAdmin._id + "" !== req.user._id + "" &&
    !GroupChat?.groupSubAdmins.includes(req.user._id)
  ) {
    throw new BadRequestError(
      `Only Admin or Sub-Admins can remove users from group`
    );
  }

  if (deleteUsers.includes(GroupChat.groupAdmin._id))
    throw new BadRequestError(`Admin can't be removed from group`);

  deleteUsers = JSON.parse(deleteUsers);
  // If there are users that are not exist in this group
  let users = [];

  deleteUsers.forEach((userId) => {
    if (!GroupChat.users.find((e) => e == userId)) users.push(userId);
  });
  if (users?.length > 0) {
    let message = {
      text: "Some of the selected users are not exist in this group Chat",
      notExistUsers: users,
    };
    throw new BadRequestError(message);
  }

  // if current user is sub-admin then he/she can't remove other sub-admins
  if (GroupChat?.groupSubAdmins.includes(req.user._id)) {
    let selectedSubAdmins = [];
    deleteUsers.forEach((u) => {
      if (GroupChat.groupSubAdmins.includes(u._id)) {
        selectedSubAdmins.push(u._id);
      }
    });
    if (selectedSubAdmins?.length > 0) {
      let message = {
        text: "Sub-Admin can't remove Sub-Admins ",
        selectedSubAdmins,
      };
      throw new BadRequestError(message);
    }
  }

  // pull all the users to be deleted, from the users list and sub-admins list
  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pullAll: {
        users: deleteUsers,
        groupSubAdmins: deleteUsers,
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password");
  if (!updatedGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);
  res.status(200).json(updatedGroupChat);
};

const addSubAdmin = async (req, res) => {
  let { chatId, userId: newSubAdminId } = req.body;
  const GroupChat = await Chat.findById(chatId);
  // if chat isn't a group chat
  if (!GroupChat?.isGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  // if logged user is not a admin or sub-admin
  if (
    GroupChat?.groupAdmin._id + "" !== req.user._id + "" &&
    !GroupChat?.groupSubAdmins.includes(req.user._id)
  ) {
    throw new BadRequestError(
      `Only Admin or Sub-Admins can add Sub-Admins in group`
    );
  }
  // if requested user in not exist in users list
  if (!GroupChat.users.includes(newSubAdminId))
    throw new BadRequestError("User is not exist in group chat");

  if (GroupChat.groupSubAdmins.includes(newSubAdminId))
    // if new sub-admin is already a subAdmin
    throw new AlreadyExistsError(`User is already a sub-admin`);

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        groupSubAdmins: newSubAdminId,
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password");
  if (!updatedGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);
  res.status(200).json(updatedGroupChat);
};

const removeSubAdmin = async (req, res) => {
  let { chatId, userId: deleteSubAdminId } = req.body;

  const GroupChat = await Chat.findById(chatId);

  if (deleteSubAdminId + "" === GroupChat.groupAdmin._id + "")
    throw new BadRequestError(`Admin can't be removed from group`);

  // if chat isn't a group chat
  if (!GroupChat?.isGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  // if logged user is not a admin
  if (GroupChat?.groupAdmin._id + "" !== req.user._id + "") {
    throw new BadRequestError(
      `Only Admin can remove Sub-Admins from the group`
    );
  }

  // if requested user in not exist in users list
  if (!GroupChat.users.includes(deleteSubAdminId))
    throw new BadRequestError("User is not exist in group chat");

  // if requested user in not exist in sub-admin list
  if (!GroupChat.groupSubAdmins.includes(deleteSubAdminId))
    throw new BadRequestError("User is not a sub-admin");

  const updatedGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        groupSubAdmins: deleteSubAdminId,
      },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("groupSubAdmins", "-password");
  if (!updatedGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);
  res.status(200).json(updatedGroupChat);
};

const leaveGroup = async (req, res) => {
  const { chatId } = req.body;

  const GroupChat = await Chat.findById(chatId);

  // if chat isn't a group chat
  if (!GroupChat?.isGroupChat)
    throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);

  // if current user isn't a group admin
  if (GroupChat.groupAdmin._id + "" === req.user._id + "") {
    const { userId } = req.body;
    const newAdmin = await User.findById(userId);
    // if new admin is not exist in db
    if (!newAdmin)
      throw new NotFoundError(`User with ID [${userId}] doesn't exist.`);

    // if new admin is not exist in group
    if (!GroupChat.users.includes(userId))
      throw new BadRequestError(`User is not exist in group chat.`);

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        groupAdmin: newAdmin,
        $pullAll: {
          groupSubAdmins: [userId, req.user._id],
        },
        $pull: {
          users: req.user._id,
        },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("groupSubAdmins", "-password");
    if (!updatedGroupChat)
      throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);
    res.status(200).json(updatedGroupChat);
  } else {
    const updatedGroupChat = await Chat.findByIdAndRemove(chatId);
    if (!updatedGroupChat)
      throw new NotFoundError(`Group Chat with ID [${chatId}] doesn't exist.`);
    res.status(200).json({
      text: `Group Chat with ID [${chatId}] is deleted successfully.`,
    });
  }
};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  addSubAdmin,
  removeSubAdmin,
  leaveGroup,
};
