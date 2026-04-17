import { asyncHandler } from "../../utils/asyncHandler.js";
import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  res.json(user);
});
