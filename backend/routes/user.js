import express from "express";
import {
  allUsers,
  login,
  signup,
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
} from "../controllers/user.js";
import authenticateUser from "../middlewares/authentication.js";
const router = express.Router();

router.route("/login").post(login);
router.post("/signup", signup);
router.post("/verify/email/send", authenticateUser, sendVerificationEmail);
router.post("/verify/email/resend", authenticateUser, reSendVerificationEmail);
router.get(
  "/verify/email/confirmation/:email/:token",
  confirmVerificationEmail
);
router.post("/password/reset/send", sendForgotPasswordOtp);
router.post("/password/reset/resend", reSendForgotPasswordOtp);
router.post("/password/reset/verify", verifyForgotPasswordOtp);
router.get("/allUsers", authenticateUser, allUsers);
router.patch("/update/avatar", authenticateUser, updateAvatar);
router.patch("/update/name", authenticateUser, updateName);
router.patch("/update/email", authenticateUser, updateEmail);
router.patch("/update/phoneNumber", authenticateUser, updatePhoneNumber);

export default router;
