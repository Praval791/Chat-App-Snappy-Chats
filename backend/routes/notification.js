import { Router } from "express";
const router = Router();
import {
  addNotification,
  getOrCreateNotifications,
  removeNotification,
} from "../controllers/notification.js";

router
  .route("/")
  .get(getOrCreateNotifications)
  .put(addNotification)
  .post(removeNotification);
export default router;
