import jwt from "jsonwebtoken";
import { User } from "../modules/auth/auth.model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token is missing.", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "sf-tutorial-secret");
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new AppError("User session is no longer valid.", 401);
  }

  req.user = user;
  next();
});
