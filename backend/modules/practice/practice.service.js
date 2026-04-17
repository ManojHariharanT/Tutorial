import { AppError } from "../../utils/AppError.js";
import {
  compareOutputs,
  evaluateFunctionSolution,
  runCodeSnippet,
} from "../../utils/codeExecution.js";
import { recordSolvedProblem } from "../progress/progress.service.js";
import { Problem, Submission } from "./practice.model.js";

const sanitizeProblemSummary = (problem) => ({
  _id: problem._id,
  title: problem.title,
  description: problem.description,
  difficulty: problem.difficulty,
  tags: problem.tags,
});

const sanitizeProblemDetail = (problem) => ({
  _id: problem._id,
  title: problem.title,
  description: problem.description,
  difficulty: problem.difficulty,
  functionName: problem.functionName,
  starterCode: problem.starterCode,
  examples: problem.examples,
  tags: problem.tags,
  testCases: problem.testCases.filter((testCase) => testCase.isSample).map((testCase) => ({
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    isSample: testCase.isSample,
  })),
});

const getProblemOrThrow = async (problemId) => {
  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new AppError("Practice problem not found.", 404);
  }

  return problem;
};

const buildEvaluationResponse = (testCases, results) => {
  const caseResults = testCases.map((testCase, index) => ({
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: results[index],
    passed: compareOutputs(results[index], testCase.expectedOutput),
  }));

  const passed = caseResults.filter((entry) => entry.passed).length;
  const total = caseResults.length;

  return {
    passed,
    total,
    status: passed === total ? "Accepted" : "Try Again",
    outcome: passed === total ? "Success" : "Failed",
    cases: caseResults,
  };
};

export const listProblems = async (difficulty) => {
  const query = difficulty && difficulty !== "All" ? { difficulty } : {};
  const problems = await Problem.find(query).sort({ createdAt: 1 }).lean();
  return problems.map(sanitizeProblemSummary);
};

export const getProblemDetail = async (problemId) => {
  const problem = await getProblemOrThrow(problemId);
  return sanitizeProblemDetail(problem.toObject());
};

export const runProblemCode = async ({ problemId, code, language = "javascript" }) => {
  const problem = await getProblemOrThrow(problemId);

  if (!code?.trim()) {
    throw new AppError("Code is required to run a solution.", 400);
  }

  const sampleCases = problem.testCases.filter((testCase) => testCase.isSample);

  if (!sampleCases.length) {
    const execution = await runCodeSnippet({ code, language });

    return {
      stdout: execution.stdout,
      stderr: execution.stderr,
      success: execution.success,
      passed: 0,
      total: 0,
      status: execution.success ? "Executed" : "Runtime Error",
      outcome: execution.success ? "Success" : "Failed",
      cases: [],
    };
  }

  const execution = await evaluateFunctionSolution({
    code,
    functionName: problem.functionName,
    testCases: sampleCases,
  });

  if (!execution.success) {
    return {
      stdout: execution.stdout,
      stderr: execution.stderr,
      success: false,
      passed: 0,
      total: sampleCases.length,
      status: "Runtime Error",
      outcome: "Failed",
      cases: [],
    };
  }

  const response = buildEvaluationResponse(sampleCases, execution.results);

  return {
    ...response,
    stdout: execution.stdout,
    stderr: execution.stderr,
    success: true,
  };
};

export const submitProblemCode = async ({
  userId,
  problemId,
  code,
  language = "javascript",
}) => {
  const problem = await getProblemOrThrow(problemId);

  if (!code?.trim()) {
    throw new AppError("Code is required to submit a solution.", 400);
  }

  const execution = await evaluateFunctionSolution({
    code,
    functionName: problem.functionName,
    testCases: problem.testCases,
  });

  if (!execution.success) {
    const failedSubmission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      result: execution.stderr || execution.stdout,
      passed: 0,
      total: problem.testCases.length,
      status: "Runtime Error",
    });

    return {
      submissionId: failedSubmission._id,
      passed: 0,
      total: problem.testCases.length,
      status: "Runtime Error",
      outcome: "Failed",
      stdout: execution.stdout,
      stderr: execution.stderr,
      cases: [],
    };
  }

  const evaluation = buildEvaluationResponse(problem.testCases, execution.results);

  const submission = await Submission.create({
    userId,
    problemId,
    code,
    language,
    result: JSON.stringify(evaluation.cases),
    passed: evaluation.passed,
    total: evaluation.total,
    status: evaluation.status,
  });

  if (evaluation.status === "Accepted") {
    await recordSolvedProblem(userId, problem._id);
  }

  return {
    submissionId: submission._id,
    passed: evaluation.passed,
    total: evaluation.total,
    status: evaluation.status,
    outcome: evaluation.outcome,
    stdout: execution.stdout,
    stderr: execution.stderr,
    cases: evaluation.cases,
  };
};
