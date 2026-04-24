import { Router } from "express";
import {
  getPlaygroundLanguages,
  runPlaygroundCode,
  streamPlaygroundCode,
} from "./playground.controller.js";

const router = Router();

router.get("/languages", getPlaygroundLanguages);
router.post("/run", runPlaygroundCode);
router.post("/run-stream", streamPlaygroundCode);

export default router;
