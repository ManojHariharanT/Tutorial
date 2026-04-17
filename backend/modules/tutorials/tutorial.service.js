import { AppError } from "../../utils/AppError.js";
import { Tutorial } from "./tutorial.model.js";

export const listTutorials = async () =>
  Tutorial.find().sort({ createdAt: 1 }).lean();

export const getTutorialById = async (tutorialId) => {
  const tutorial = await Tutorial.findById(tutorialId).lean();

  if (!tutorial) {
    throw new AppError("Tutorial not found.", 404);
  }

  return tutorial;
};
