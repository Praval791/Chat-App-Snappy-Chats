import { User } from "../models/User.js";
import { Chat } from "../models/Chat.js";
import { Notifications } from "../models/Notifications.js";

import NotFoundError from "../errors/not-found.js";
// import BadRequestError from "../errors/bad-request.js";

// get or create notifications of user
const getOrCreateNotifications = async (req, res) => {
  var notification = await Notifications.findOne({
    _userId: req.user._id,
  }).populate("notifications");

  if (!notification)
    notification = await Notifications.create({ _userId: req.user._id });

  notification = await Chat.populate(notification, {
    path: "notifications.chat",
  });
  notification = await User.populate(notification, [
    {
      path: "notifications.sender",
      select: "-password",
    },
    {
      path: "notifications.chat.users",
      select: "-password",
    },
  ]);

  if (!notification) throw new Error(`Unable to get notifications`);
  res.status(200).json(notification);
};

// add new notifications
const addNotification = async (req, res) => {
  const { messages } = req.body;

  var notification = await Notifications.findOne({ _userId: req.user._id });

  if (!notification)
    throw new NotFoundError(
      "Unable to update notifications. Please try again later!"
    );

  var newMessages = messages && messages.length > 0 ? JSON.parse(messages) : [];
  newMessages = newMessages.filter(
    (message) => !notification.notifications.includes(message)
  );
  notification = await Notifications.findByIdAndUpdate(
    notification._id,
    {
      $push: {
        notifications: {
          $each: newMessages,
        },
      },
    },
    { new: true }
  ).populate("notifications");

  notification = await Chat.populate(notification, {
    path: "notifications.chat",
  });
  notification = await User.populate(notification, [
    {
      path: "notifications.sender",
      select: "-password",
    },
    {
      path: "notifications.chat.users",
      select: "-password",
    },
  ]);

  if (!notification) throw new Error(`Unable to update notifications`);
  res.status(200).json(notification);
};

// remove notifications
const removeNotification = async (req, res) => {
  const { messages } = req.body;

  var notification = await Notifications.findOne({ _userId: req.user._id });

  if (!notification)
    throw new NotFoundError(
      "Unable to update notifications. Please try again later!"
    );

  var newMessages = messages && messages.length > 0 ? JSON.parse(messages) : [];
  newMessages = newMessages.filter((message) =>
    notification.notifications.includes(message)
  );
  notification = await Notifications.findByIdAndUpdate(
    notification._id,
    {
      $pullAll: {
        notifications: newMessages,
      },
    },
    { new: true }
  ).populate("notifications");

  notification = await Chat.populate(notification, {
    path: "notifications.chat",
  });
  notification = await User.populate(notification, [
    {
      path: "notifications.sender",
      select: "-password",
    },
    {
      path: "notifications.chat.users",
      select: "-password",
    },
  ]);
  // console.log(user);

  if (!notification) throw new Error(`Unable to update notifications`);
  res.status(200).json(notification);
};

export { addNotification, removeNotification, getOrCreateNotifications };
