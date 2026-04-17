import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  getProblemDetail,
  listProblems,
  runProblemCode,
  submitProblemCode,
} from "./practice.service.js";

export const getProblems = asyncHandler(async (req, res) => {
  const problems = await listProblems(req.query.difficulty);
  res.json(problems);
});

export const getProblem = asyncHandler(async (req, res) => {
  const problem = await getProblemDetail(req.params.problemId);
  res.json(problem);
});

export const runCode = asyncHandler(async (req, res) => {
  const result = await runProblemCode({
    problemId: req.params.problemId,
    code: req.body.code,
    language: req.body.language,
  });

  res.json(result);
});

export const submitCode = asyncHandler(async (req, res) => {
  const result = await submitProblemCode({
    userId: req.user._id,
    problemId: req.body.problemId,
    code: req.body.code,
    language: req.body.language,
  });

  res.json(result);
});
