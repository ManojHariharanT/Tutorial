import { AppError } from "../../utils/AppError.js";
import { runCodeSnippet, streamCodeSnippet } from "../../utils/codeExecution.js";
import { PlaygroundRun } from "./playground.model.js";

export const executePlaygroundCode = async ({ code, language, userId }) => {
  if (!code?.trim()) {
    throw new AppError("Code is required to run the playground.", 400);
  }

  const result = await runCodeSnippet({
    code,
    language,
  });

  await PlaygroundRun.create({
    userId: userId || null,
    language: language || "javascript",
    code,
    output: result.stderr || result.stdout,
    success: result.success,
  });

  return result;
};

export const streamPlaygroundCodeExecution = async ({ code, language, userId, onStdout, onStderr, onEnd }) => {
  if (!code?.trim()) {
    throw new AppError("Code is required to run the playground.", 400);
  }

  const result = await streamCodeSnippet({
    code,
    language,
    onStdout,
    onStderr,
  });

  await PlaygroundRun.create({
    userId: userId || null,
    language: language || "javascript",
    code,
    output: result.stderr || result.stdout,
    success: result.success,
  });

  onEnd(result);
};
