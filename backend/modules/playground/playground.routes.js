import { Router } from "express";
import { runPlaygroundCode, streamPlaygroundCode } from "./playground.controller.js";

const router = Router();

router.post("/run", runPlaygroundCode);
router.post("/run-stream", streamPlaygroundCode);

export default router;
