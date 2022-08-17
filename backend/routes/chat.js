import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  addSubAdmin,
  removeSubAdmin,
  leaveGroup,
} from "../controllers/chat.js";
const router = express.Router();

router.route("/").post(accessChat).get(fetchChats);

router.route("/groups/").post(createGroupChat);
router.route("/groups/rename").put(renameGroup);
router.route("/groups/remove").put(removeFromGroup);
router.route("/groups/add").put(addToGroup);
router.put("/groups/addSubAdmin", addSubAdmin);
router.put("/groups/removeSubAdmin", removeSubAdmin);
router.put("/groups/leaveGroup", leaveGroup);
export default router;
