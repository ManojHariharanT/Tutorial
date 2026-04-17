import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { getProblem, getProblems, runCode, submitCode } from "./practice.controller.js";

const router = Router();

router.get("/problems", getProblems);
router.get("/problems/:problemId", getProblem);
router.post("/problems/:problemId/run", runCode);
router.post("/submit", protect, submitCode);

export default router;
