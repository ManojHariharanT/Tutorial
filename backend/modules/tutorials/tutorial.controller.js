import { asyncHandler } from "../../utils/asyncHandler.js";
import { getTutorialById, listTutorials } from "./tutorial.service.js";

export const getTutorials = asyncHandler(async (_req, res) => {
  const tutorials = await listTutorials();
  res.json(tutorials);
});

export const getTutorial = asyncHandler(async (req, res) => {
  const tutorial = await getTutorialById(req.params.tutorialId);
  res.json(tutorial);
});
