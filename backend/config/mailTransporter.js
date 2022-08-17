import { config } from "dotenv";
import nodemailer from "nodemailer";
config();
export default nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});
