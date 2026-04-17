import { AppError } from "../../utils/AppError.js";
import { Submission } from "../practice/practice.model.js";
import { Tutorial } from "../tutorials/tutorial.model.js";
import { Progress } from "./progress.model.js";

const ensureProgress = async (userId) => {
  let progress = await Progress.findOne({ userId });

  if (!progress) {
    progress = await Progress.create({
      userId,
      completedTutorials: [],
      solvedProblems: [],
    });
  }

  return progress;
};

export const markTutorialComplete = async (userId, tutorialId) => {
  const tutorial = await Tutorial.findById(tutorialId);

  if (!tutorial) {
    throw new AppError("Tutorial not found.", 404);
  }

  const progress = await ensureProgress(userId);

  if (!progress.completedTutorials.some((entry) => entry.equals(tutorial._id))) {
    progress.completedTutorials.push(tutorial._id);
    await progress.save();
  }

  return progress;
};

export const recordSolvedProblem = async (userId, problemId) => {
  const progress = await ensureProgress(userId);

  if (!progress.solvedProblems.some((entry) => entry.equals(problemId))) {
    progress.solvedProblems.push(problemId);
    await progress.save();
  }
};

export const getProgressOverview = async (userId) => {
  const progress = await ensureProgress(userId);

  const populatedProgress = await Progress.findById(progress._id)
    .populate("completedTutorials", "title description")
    .populate("solvedProblems", "title difficulty")
    .lean();

  const recentSubmissions = await Submission.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("problemId", "title difficulty")
    .lean();

  const acceptedCount = await Submission.countDocuments({
    userId,
    status: "Accepted",
  });
  const totalSubmissions = await Submission.countDocuments({ userId });

  return {
    stats: {
      completedTutorialCount: populatedProgress.completedTutorials.length,
      solvedProblemCount: populatedProgress.solvedProblems.length,
      totalSubmissions,
      acceptanceRate: totalSubmissions
        ? Math.round((acceptedCount / totalSubmissions) * 100)
        : 0,
    },
    completedTutorials: populatedProgress.completedTutorials,
    solvedProblems: populatedProgress.solvedProblems,
    recentSubmissions,
  };
};
