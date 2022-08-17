import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

const auth = async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  // console.log(req.headers);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // other way to stick the data to req obj
    // req.user = { userId: payload.userId, name: payload.name };

    const user = await User.findById(payload.userId).select("-password");
    if (!user)
      throw new NotFoundError(
        `User with User-ID ${payload.userId} doesn't exist`
      );
    req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid, Token Failed");
  }
};
export default auth;
