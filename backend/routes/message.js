import { Router } from "express";
import { allMessages, sendMessage } from "../controllers/message.js";

const router = Router();

router.route("/").post(sendMessage);
router.get("/:chatId", allMessages);

export default router;
