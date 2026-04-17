import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { completeTutorial, getOverview } from "./progress.controller.js";

const router = Router();

router.use(protect);
router.get("/overview", getOverview);
router.post("/tutorials/:tutorialId/complete", completeTutorial);

export default router;
