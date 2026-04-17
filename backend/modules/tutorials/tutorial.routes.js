import { Router } from "express";
import { getTutorial, getTutorials } from "./tutorial.controller.js";

const router = Router();

router.get("/", getTutorials);
router.get("/:tutorialId", getTutorial);

export default router;
