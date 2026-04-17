import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { getProfile, login, register } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);

export default router;
