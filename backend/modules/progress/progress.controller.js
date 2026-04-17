import { asyncHandler } from "../../utils/asyncHandler.js";
import { getProgressOverview, markTutorialComplete } from "./progress.service.js";

export const getOverview = asyncHandler(async (req, res) => {
  const overview = await getProgressOverview(req.user._id);
  res.json(overview);
});

export const completeTutorial = asyncHandler(async (req, res) => {
  await markTutorialComplete(req.user._id, req.params.tutorialId);
  const overview = await getProgressOverview(req.user._id);
  res.json(overview);
});
